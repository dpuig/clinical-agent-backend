package ehr

import (
	"fmt"
	"time"

	"clinical-agent-backend/internal/domain"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

// MapToFHIR converts a domain ClinicalNote into a FHIR R4 ClinicalImpression.
func MapToFHIR(note domain.ClinicalNote) (*fhir.ClinicalImpression, error) {
	now := time.Now().Format(time.RFC3339)
	status := fhir.ClinicalImpressionStatusCompleted

	impression := &fhir.ClinicalImpression{
		Status:  status,
		Date:    &now,
		Summary: errorsStringPtr(fmt.Sprintf("Automated Clinical Impression from AI Agent. HPI: %v", note.HPI)),
		Finding: make([]fhir.ClinicalImpressionFinding, 0),
	}

	// Map Symptoms to Findings
	for _, symptom := range note.Symptoms {
		item := fhir.Reference{
			Display: &symptom,
		}
		impression.Finding = append(impression.Finding, fhir.ClinicalImpressionFinding{
			ItemCodeableConcept: &fhir.CodeableConcept{
				Text: &symptom,
			},
			ItemReference: &item,
		})
	}

	// Note: Medications would typically map to MedicationStatement, but for simplicity
	// in this phase, we add them to the summary or as a finding with a specific code.
	// Here we append to summary for visibility.
	if len(note.Medications) > 0 {
		currentSummary := ""
		if impression.Summary != nil {
			currentSummary = *impression.Summary
		}
		newSummary := fmt.Sprintf("%s. Current Medications: %v", currentSummary, note.Medications)
		impression.Summary = &newSummary
	}

	return impression, nil
}

func errorsStringPtr(s string) *string {
	return &s
}
