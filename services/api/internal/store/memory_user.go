package store

import (
	"context"
	"strings"
	"sync"

	"github.com/mr-aminul/law-erp/services/api/internal/auth"
)

// MemoryUserStore backs auth in local dev when Postgres is unavailable.
type MemoryUserStore struct {
	mu    sync.RWMutex
	users map[string]User
}

func (s *MemoryUserStore) add(id, email, fullName, passwordHash, role string) {
	email = strings.ToLower(strings.TrimSpace(email))
	s.users[email] = User{
		ID:       id,
		FirmID:   DevFirmID,
		FirmName: "Law ERP Development",
		FirmSlug: "law-erp-dev",
		Email:    email,
		FullName: fullName,
		Role:     role,
		Status:   "active",
		Password: passwordHash,
	}
}

func (s *MemoryUserStore) FindByEmail(_ context.Context, email string) (*User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	user, ok := s.users[strings.ToLower(strings.TrimSpace(email))]
	if !ok {
		return nil, ErrUserNotFound
	}
	copy := user
	return &copy, nil
}

func (s *MemoryUserStore) FindByID(_ context.Context, id string) (*User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, user := range s.users {
		if user.ID == id {
			copy := user
			return &copy, nil
		}
	}
	return nil, ErrUserNotFound
}

func (s *MemoryUserStore) TouchLogin(context.Context, string) error {
	return nil
}

func (s *MemoryUserStore) UpdateAvatarURL(_ context.Context, userID, avatarURL string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	for email, user := range s.users {
		if user.ID != userID {
			continue
		}
		user.AvatarURL = avatarURL
		s.users[email] = user
		return nil
	}
	return ErrUserNotFound
}

func NewDevAuthStore() *MemoryUserStore {
	hash, err := auth.HashPassword("DevPass123!")
	if err != nil {
		panic(err)
	}

	s := &MemoryUserStore{users: make(map[string]User)}
	s.add(DevUserID, "saif.alam@gmail.com", "Saif Alam", hash, "firm_owner")
	s.add(DevUserID2, "alam.saifivna@gmail.com", "Saif Alam", hash, "firm_owner")
	return s
}
