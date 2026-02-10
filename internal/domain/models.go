package domain

// ClinicalNote represents the structured clinical data extracted from a conversation.
type ClinicalNote struct {
	Symptoms    []string `json:"symptoms"`
	Medications []string `json:"medications"`
	HPI         []string `json:"hpi"`
}
