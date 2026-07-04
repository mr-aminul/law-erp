// Package domain defines governance types enforced in Postgres and application code.
package domain

// DataClassification mirrors Postgres enum data_classification.
type DataClassification string

const (
	ClassPublic       DataClassification = "public"
	ClassInternal     DataClassification = "internal"
	ClassConfidential DataClassification = "confidential"
	ClassPrivileged   DataClassification = "privileged"
)

// AIConsentScope mirrors Postgres enum ai_consent_scope.
type AIConsentScope string

const (
	ScopeAnonymizedCaseMetadata         AIConsentScope = "anonymized_case_metadata"
	ScopeAnonymizedDocumentSummaries    AIConsentScope = "anonymized_document_summaries"
	ScopeAnonymizedWorkflowPatterns     AIConsentScope = "anonymized_workflow_patterns"
)

// TrainableRow is implemented by persisted entities subject to AI export rules.
type TrainableRow interface {
	FirmID() string
	Classification() DataClassification
	TrainingEligible() bool
}

// CanMarkTrainingEligible returns false for privileged rows (DB constraint is backup).
func CanMarkTrainingEligible(class DataClassification) bool {
	return class != ClassPrivileged
}

// GovernanceColumns documents fields every tenant table must carry (see migrations).
type GovernanceColumns struct {
	FirmID             string
	DataClassification DataClassification
	AITrainingEligible bool
	AIExportedAt       *string
	RetentionUntil     *string
}
