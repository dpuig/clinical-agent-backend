package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"clinical-agent-backend/internal/db"
	"clinical-agent-backend/internal/ingestion"
	"clinical-agent-backend/internal/intelligence"
	"clinical-agent-backend/internal/repository"
)

func main() {
	ctx := context.Background()

	// Configuration
	projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	location := os.Getenv("GOOGLE_CLOUD_LOCATION")
	if projectID == "" {
		projectID = "clinical-agent-dev" // Default for dev
		log.Printf("GOOGLE_CLOUD_PROJECT not set, using default: %s", projectID)
	}
	if location == "" {
		location = "us-central1"
		log.Printf("GOOGLE_CLOUD_LOCATION not set, using default: %s", location)
	}

	// Initialize STT Client
	sttClient, err := intelligence.NewSTTClient(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize STT client: %v", err)
	}

	// Initialize LLM Client
	llmClient, err := intelligence.NewLLMClient(ctx, projectID, location)
	if err != nil {
		log.Fatalf("Failed to initialize LLM client: %v", err)
	}
	defer llmClient.Close()

	// Initialize Database
	dbDSN := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)
	dbPool, err := db.NewConnection(ctx, dbDSN)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer dbPool.Close()

	// Initialize Repository
	clinicalRepo := repository.NewClinicalImpressionRepository(dbPool)

	// Initialize Ingestion Service
	ingestionHandler := ingestion.NewHandler(sttClient, llmClient, clinicalRepo)

	// Register Routes
	http.HandleFunc("/ws/audio", ingestionHandler.ServeWS)
	http.HandleFunc("/upload-audio", ingestionHandler.HandleUpload)
	http.HandleFunc("/impressions", ingestionHandler.HandleGetImpressions)
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	log.Println("Starting Clinical Agent Backend on :8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
