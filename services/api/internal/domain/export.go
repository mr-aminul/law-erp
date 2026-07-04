package domain

import "errors"

var (
	ErrPrivilegedNotTrainable = errors.New("privileged data cannot be marked ai_training_eligible")
	ErrConsentRequired        = errors.New("firm has no active AI consent for this scope")
	ErrExportFromProduction   = errors.New("training jobs must read training.snapshots, not production tables")
)

// ExportCandidateFilter encodes the same rules as v_ai_export_eligible_cases.
type ExportCandidateFilter struct {
	FirmID              string
	Scope               AIConsentScope
	HasActiveConsent    bool
	IncludeOnlyEligible bool
}

// ValidateTrainingEligibility is called before setting ai_training_eligible in application code.
func ValidateTrainingEligibility(class DataClassification, hasConsent bool) error {
	if !CanMarkTrainingEligible(class) {
		return ErrPrivilegedNotTrainable
	}
	if !hasConsent {
		return ErrConsentRequired
	}
	return nil
}
