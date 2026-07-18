package store

import "github.com/mr-aminul/law-erp/services/api/graph/model"

// SeedStore serves in-memory seed data until Postgres is wired.
type SeedStore struct{}

func NewSeedStore() *SeedStore {
	return &SeedStore{}
}

func (s *SeedStore) Health(env string) *model.Health {
	return &model.Health{
		Status:  "ok",
		Service: "law-erp-api",
		Env:     env,
	}
}

func (s *SeedStore) DashboardStats() *model.DashboardStats {
	return &model.DashboardStats{
		Hearings: &model.HearingStats{
			Today:     3,
			ThisMonth: 18,
			ThisYear:  142,
		},
		Invoices: &model.InvoiceStats{
			Count:         24,
			Amount:        1845000,
			ReceiptCount:  18,
			ReceiptAmount: 1420000,
		},
		Cases: &model.CaseCountStats{
			New:       8,
			Pending:   14,
			Completed: 42,
		},
		Hr: &model.HRStats{
			Total:   12,
			Present: 10,
			Absent:  2,
		},
	}
}

func (s *SeedStore) CaseStatusChart() []*model.StatusSlice {
	return []*model.StatusSlice{
		{Name: "Completed", Value: 42, Color: "#123f2f"},
		{Name: "In-Progress", Value: 18, Color: "#1d4ed8"},
		{Name: "Pending", Value: 14, Color: "#b87d2b"},
		{Name: "New", Value: 8, Color: "#64748b"},
		{Name: "On-Hold", Value: 5, Color: "#94a3b8"},
	}
}

func (s *SeedStore) MonthlyCases() []*model.MonthlyCasePoint {
	return []*model.MonthlyCasePoint{
		{Month: "Jan", Cases: 6},
		{Month: "Feb", Cases: 8},
		{Month: "Mar", Cases: 12},
		{Month: "Apr", Cases: 9},
		{Month: "May", Cases: 14},
		{Month: "Jun", Cases: 11},
		{Month: "Jul", Cases: 7},
		{Month: "Aug", Cases: 10},
		{Month: "Sep", Cases: 13},
		{Month: "Oct", Cases: 8},
		{Month: "Nov", Cases: 15},
		{Month: "Dec", Cases: 9},
	}
}

func (s *SeedStore) RecentCases(limit int) []*model.CaseSummary {
	all := []*model.CaseSummary{
		{
			ID: "1", CaseID: "CS-2024-001", Matter: "Contract Dispute — Bashundhara",
			ClientName: "Bashundhara Group", Status: "In-Progress",
			NextHearing: strPtr("2026-07-15"), AssignedLawyers: []string{"Rahima Khan"},
		},
		{
			ID: "2", CaseID: "CS-2024-002", Matter: "Labour Tribunal — Grameen",
			ClientName: "Grameen Telecom", Status: "Pending",
			NextHearing: strPtr("2026-07-22"), AssignedLawyers: []string{"Tanvir Ahmed"},
		},
		{
			ID: "3", CaseID: "CS-2025-003", Matter: "Property Suit — Dhanmondi",
			ClientName: "Mr. Karim Uddin", Status: "New",
			AssignedLawyers: []string{"Nusrat Jahan"},
		},
	}
	if limit <= 0 || limit > len(all) {
		return all
	}
	return all[:limit]
}

func strPtr(s string) *string {
	return &s
}
