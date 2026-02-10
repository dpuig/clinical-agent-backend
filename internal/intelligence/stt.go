package intelligence

import (
	"context"
	"fmt"
	"io"
	"log"

	speech "cloud.google.com/go/speech/apiv1"
	speechpb "cloud.google.com/go/speech/apiv1/speechpb"
)

// STTClient wraps the Google Cloud Speech client.
type STTClient struct {
	client *speech.Client
}

// NewSTTClient creates a new Speech-to-Text client.
func NewSTTClient(ctx context.Context) (*STTClient, error) {
	client, err := speech.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create speech client: %w", err)
	}
	return &STTClient{client: client}, nil
}

// StreamTranscribe streams audio data to Google Cloud Speech-to-Text and returns a channel of transcripts.
func (s *STTClient) StreamTranscribe(ctx context.Context, audioStream io.Reader) (<-chan string, <-chan error) {
	transcripts := make(chan string)
	errs := make(chan error)

	stream, err := s.client.StreamingRecognize(ctx)
	if err != nil {
		go func() { errs <- fmt.Errorf("failed to start streaming recognize: %w", err) }()
		return transcripts, errs
	}

	// Send the initial configuration message.
	if err := stream.Send(&speechpb.StreamingRecognizeRequest{
		StreamingRequest: &speechpb.StreamingRecognizeRequest_StreamingConfig{
			StreamingConfig: &speechpb.StreamingRecognitionConfig{
				Config: &speechpb.RecognitionConfig{
					Encoding:        speechpb.RecognitionConfig_LINEAR16,
					SampleRateHertz: 16000,
					LanguageCode:    "en-US",
					Model:           "default",
					UseEnhanced:     false,
				},
				InterimResults: true,
			},
		},
	}); err != nil {
		go func() { errs <- fmt.Errorf("failed to send config: %w", err) }()
		return transcripts, errs
	}

	// Goroutine to send audio data
	go func() {
		defer stream.CloseSend()
		buf := make([]byte, 4096)
		for {
			n, err := audioStream.Read(buf)
			if n > 0 {
				if err := stream.Send(&speechpb.StreamingRecognizeRequest{
					StreamingRequest: &speechpb.StreamingRecognizeRequest_AudioContent{
						AudioContent: buf[:n],
					},
				}); err != nil {
					errs <- fmt.Errorf("failed to send audio: %w", err)
					return
				}
			}
			if err == io.EOF {
				return
			}
			if err != nil {
				errs <- fmt.Errorf("error reading audio stream: %w", err)
				return
			}
		}
	}()

	// Goroutine to receive transcripts
	go func() {
		defer close(transcripts)
		defer close(errs)
		for {
			resp, err := stream.Recv()
			if err == io.EOF {
				return
			}
			if err != nil {
				errs <- fmt.Errorf("stream receive error: %w", err)
				return
			}
			for _, result := range resp.Results {
				if len(result.Alternatives) > 0 {
					transcript := result.Alternatives[0].Transcript
					if result.IsFinal {
						log.Printf("Final Transcript: %s", transcript)
					}
					transcripts <- transcript
				}
			}
		}
	}()

	return transcripts, errs
}
