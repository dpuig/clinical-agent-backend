package repository

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

// ClinicalImpressionRepository handles database operations for Clinical Impressions.
type ClinicalImpressionRepository struct {
	db *pgxpool.Pool
}

// NewClinicalImpressionRepository creates a new repository instance.
func NewClinicalImpressionRepository(db *pgxpool.Pool) *ClinicalImpressionRepository {
	return &ClinicalImpressionRepository{db: db}
}

// Save persists a FHIR ClinicalImpression resource to the database.
func (r *ClinicalImpressionRepository) Save(ctx context.Context, impression *fhir.ClinicalImpression) error {
	// Serialize FHIR resource to JSON
	rawFHIR, err := json.Marshal(impression)
	if err != nil {
		return fmt.Errorf("failed to marshal FHIR resource: %w", err)
	}

	// Extract fields for searchable columns (optional, but good for indexing later)
	var patientID string
	if impression.Subject.Reference != nil {
		patientID = *impression.Subject.Reference
	}

	var description string
	if impression.Summary != nil {
		description = *impression.Summary
	}

	// Extract status from JSON because the struct field is an int enum
	var tempMap map[string]interface{}
	if err := json.Unmarshal(rawFHIR, &tempMap); err != nil {
		return fmt.Errorf("failed to unmarshal raw FHIR for status extraction: %w", err)
	}
	status, _ := tempMap["status"].(string)

	query := `
		INSERT INTO clinical_impressions (patient_id, status, description, raw_fhir)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`

	var id int
	err = r.db.QueryRow(ctx, query, patientID, status, description, rawFHIR).Scan(&id)
	if err != nil {
		return fmt.Errorf("failed to insert clinical impression: %w", err)
	}

	return nil
}

// FindAll retrieves all clinical impressions, ordered by ID descending.
func (r *ClinicalImpressionRepository) FindAll(ctx context.Context) ([]*fhir.ClinicalImpression, error) {
	query := `
		SELECT raw_fhir FROM clinical_impressions
		ORDER BY id DESC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query clinical impressions: %w", err)
	}
	defer rows.Close()

	var impressions []*fhir.ClinicalImpression
	for rows.Next() {
		var rawFHIR []byte
		if err := rows.Scan(&rawFHIR); err != nil {
			return nil, fmt.Errorf("failed to scan raw FHIR: %w", err)
		}

		var impression fhir.ClinicalImpression
		if err := json.Unmarshal(rawFHIR, &impression); err != nil {
			return nil, fmt.Errorf("failed to unmarshal FHIR: %w", err)
		}
		impressions = append(impressions, &impression)
	}

	if rows.Err() != nil {
		return nil, fmt.Errorf("rows iteration error: %w", rows.Err())
	}

	return impressions, nil
}
