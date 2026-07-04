package domain_test

import (
	"testing"

	"github.com/mr-aminul/law-erp/services/api/internal/domain"
)

func TestValidateTrainingEligibility(t *testing.T) {
	t.Run("rejects privileged", func(t *testing.T) {
		err := domain.ValidateTrainingEligibility(domain.ClassPrivileged, true)
		if err != domain.ErrPrivilegedNotTrainable {
			t.Fatalf("got %v", err)
		}
	})

	t.Run("requires consent", func(t *testing.T) {
		err := domain.ValidateTrainingEligibility(domain.ClassConfidential, false)
		if err != domain.ErrConsentRequired {
			t.Fatalf("got %v", err)
		}
	})

	t.Run("allows confidential with consent", func(t *testing.T) {
		if err := domain.ValidateTrainingEligibility(domain.ClassConfidential, true); err != nil {
			t.Fatalf("unexpected %v", err)
		}
	})
}
