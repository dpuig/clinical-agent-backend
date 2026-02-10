package intelligence

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"clinical-agent-backend/internal/domain"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// LLMClient wraps the Google Generative AI client.
type LLMClient struct {
	client *genai.Client
	model  *genai.GenerativeModel
}

// NewLLMClient creates a new Generative AI client.
// arguments projectID and location are kept for compatibility but might not be used if using API Key.
// If using Service Account (ADC), the project is inferred from credentials.
func NewLLMClient(ctx context.Context, projectID string, location string) (*LLMClient, error) {
	var opts []option.ClientOption

	// Check for API Key first (common for AI Studio)
	if apiKey := os.Getenv("GEMINI_API_KEY"); apiKey != "" {
		opts = append(opts, option.WithAPIKey(apiKey))
	} else if creds := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS"); creds != "" {
		opts = append(opts, option.WithCredentialsFile(creds))
	}

	client, err := genai.NewClient(ctx, opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to create genai client: %w", err)
	}

	// Use Gemini 2.0 Flash
	model := client.GenerativeModel("gemini-2.0-flash")
	// Set response MIME type to JSON for structured output if supported,
	// or rely on prompt engineering. Gemini-pro 1.0 supports JSON mode but
	// the library usage might differ slightly.
	// "responseMIMEType" is a configuration option.
	model.ResponseMIMEType = "application/json"

	return &LLMClient{client: client, model: model}, nil
}

// GenerateResponse generates a response from the model based on the prompt.
func (c *LLMClient) GenerateResponse(ctx context.Context, prompt string) (string, error) {
	resp, err := c.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", fmt.Errorf("failed to generate content: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("no content generated")
	}

	// Assuming text response for now
	if txt, ok := resp.Candidates[0].Content.Parts[0].(genai.Text); ok {
		return string(txt), nil
	}

	return "", fmt.Errorf("unexpected response format")
}

// ExtractEntities extracts medical entities from the provided text.
func (c *LLMClient) ExtractEntities(ctx context.Context, text string) (*domain.ClinicalNote, error) {
	prompt := fmt.Sprintf(`
You are an expert clinical assistant. Extract the following entities from the text below:
- Symptoms
- Medications
- HPI (History of Present Illness) key points

Format the output as a JSON object matching this structure:
{
  "symptoms": ["string"],
  "medications": ["string"],
  "hpi": ["string"]
}

Text: "%s"
`, text)

	respStr, err := c.GenerateResponse(ctx, prompt)
	if err != nil {
		return nil, err
	}

	// Clean up markdown code blocks if present (Gemini sometimes returns ```json ... ```)
	respStr = strings.TrimPrefix(respStr, "```json")
	respStr = strings.TrimPrefix(respStr, "```")
	respStr = strings.TrimSuffix(respStr, "```")
	respStr = strings.TrimSpace(respStr)

	var note domain.ClinicalNote
	if err := json.Unmarshal([]byte(respStr), &note); err != nil {
		// Log the raw response for debugging
		fmt.Printf("Raw response failed unmarshal: %s\n", respStr)
		return nil, fmt.Errorf("failed to unmarshal clinical note: %w", err)
	}

	return &note, nil
}

// Close closes the underlying client.
func (c *LLMClient) Close() {
	c.client.Close()
}
