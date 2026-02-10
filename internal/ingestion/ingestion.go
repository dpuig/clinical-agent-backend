package ingestion

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"sync/atomic"

	"clinical-agent-backend/internal/ehr"
	"clinical-agent-backend/internal/intelligence"
	"clinical-agent-backend/internal/repository"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for dev
	},
}

// Handler manages WebSocket connections for audio ingestion.
type Handler struct {
	sttClient *intelligence.STTClient
	llmClient *intelligence.LLMClient
	repo      *repository.ClinicalImpressionRepository
}

// NewHandler creates a new Ingestion Handler.
func NewHandler(stt *intelligence.STTClient, llm *intelligence.LLMClient, repo *repository.ClinicalImpressionRepository) *Handler {
	return &Handler{
		sttClient: stt,
		llmClient: llm,
		repo:      repo,
	}
}

// ServeWS handles incoming WebSocket connections.
func (h *Handler) ServeWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade websocket: %v", err)
		return
	}
	defer conn.Close()

	log.Println("Client connected for audio ingestion")

	// Create a pipe to stream audio from WebSocket to STT
	pr, pw := io.Pipe()

	// Atomic flag to signal shutdown
	var isClosing int32

	// Goroutine to read from WebSocket and write to Pipe
	go func() {
		defer pw.Close()
		for {
			messageType, data, err := conn.ReadMessage()
			if err != nil {
				// If we are closing, this error is expected
				if atomic.LoadInt32(&isClosing) == 1 {
					return
				}
				// Filter out "close 1000 (normal)" or similar non-error closes if needed,
				// but primarily we want to suppress the "use of closed network connection"
				// which happens when the server closes the connection due to STT timeout.
				if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
					log.Printf("Websocket closed by client: %v", err)
					return
				}
				log.Printf("Websocket read error: %v", err)
				return
			}
			if messageType == websocket.TextMessage {
				if string(data) == "EOF" {
					log.Println("Received EOF from client, finishing audio stream")
					// Send Close frame to acknowledge clean shutdown
					closeMsg := websocket.FormatCloseMessage(websocket.CloseNormalClosure, "Client initiated EOF")
					if werr := conn.WriteMessage(websocket.CloseMessage, closeMsg); werr != nil {
						log.Printf("Failed to write close message on EOF: %v", werr)
					}
					return
				}
			}
			if messageType == websocket.BinaryMessage {
				if _, err := pw.Write(data); err != nil {
					log.Printf("Pipe write error: %v", err)
					return
				}
			}
		}
	}()

	// Stream audio to STT
	transcripts, errs := h.sttClient.StreamTranscribe(r.Context(), pr)

	// Process transcripts
	go func() {
		for transcript := range transcripts {
			log.Printf("Transcript: %s", transcript)

			// Send transcript back to client
			if err := conn.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("Transcript: %s", transcript))); err != nil {
				log.Printf("Websocket write error: %v", err)
			}

			// Async Entity Extraction (Fire and Forget for now)
			go func(text string) {
				note, err := h.llmClient.ExtractEntities(context.Background(), text)
				if err != nil {
					log.Printf("Entity extraction failed: %v", err)
					return
				}
				log.Printf("Extracted Clinical Note: %+v", note)

				// Map to FHIR
				fhirResource, err := ehr.MapToFHIR(*note)
				if err != nil {
					log.Printf("FHIR mapping failed: %v", err)
					return
				}

				// Serialize to JSON for logging
				fhirJSON, _ := json.MarshalIndent(fhirResource, "", "  ")
				log.Printf("Generated FHIR ClinicalImpression:\n%s", string(fhirJSON))

				// Save to Database
				if err := h.repo.Save(context.Background(), fhirResource); err != nil {
					log.Printf("Failed to save clinical impression to DB: %v", err)
					return
				}
				log.Println("Successfully saved Clinical Impression to DB")

			}(transcript)
		}
	}()

	// Handle errors
	// Since we only expect one error or end of stream from SttClient, we can just read once.
	if err := <-errs; err != nil {
		log.Printf("STT Stream ended: %v", err)
		// Signal shutdown to reader goroutine
		atomic.StoreInt32(&isClosing, 1)

		// Send error to client if possible (might fail if connection is already unstable)
		// We send a text message first to explain the error
		if werr := conn.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("Error: %v", err))); werr != nil {
			log.Printf("Failed to write error message: %v", werr)
			return
		}

		// Send Close frame to initiate clean shutdown
		closeMsg := websocket.FormatCloseMessage(websocket.CloseNormalClosure, "STT stream ended")
		if werr := conn.WriteMessage(websocket.CloseMessage, closeMsg); werr != nil {
			log.Printf("Failed to write close message: %v", werr)
		}
	}
}
