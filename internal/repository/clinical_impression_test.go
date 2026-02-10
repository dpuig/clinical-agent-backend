package repository

import (
	"context"
	"testing"
	"time"

	"clinical-agent-backend/internal/db"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

func TestClinicalImpressionRepository_Save(t *testing.T) {
	// Skip if no database connection (INTEGRATION TEST)
	// We can try to connect to localhost:5432 user=clinical_user password=clinical_pass dbname=clinical_agent
	dsn := "postgres://clinical_user:clinical_pass@localhost:5432/clinical_agent"

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := db.NewConnection(ctx, dsn)
	if err != nil {
		t.Skipf("Skipping integration test: failed to connect to db: %v", err)
	}
	defer pool.Close()

	repo := NewClinicalImpressionRepository(pool)

	now := time.Now().Format(time.RFC3339)
	summary := "Test Impression"
	subjectRef := "Patient/123"

	impression := &fhir.ClinicalImpression{
		Status:  fhir.ClinicalImpressionStatusCompleted,
		Date:    &now,
		Summary: &summary,
		Subject: fhir.Reference{
			Reference: &subjectRef,
		},
	}

	err = repo.Save(ctx, impression)
	if err != nil {
		t.Fatalf("Failed to save impression: %v", err)
	}

	// Verify insertion
	var count int
	err = pool.QueryRow(ctx, "SELECT count(*) FROM clinical_impressions WHERE description = $1", summary).Scan(&count)
	if err != nil {
		t.Fatalf("Failed to query count: %v", err)
	}
	if count != 1 {
		t.Errorf("Expected 1 record, got %d", count)
	}
}
