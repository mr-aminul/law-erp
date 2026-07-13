package store

import "context"

// UserRepository is implemented by Postgres and in-memory dev stores.
type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*User, error)
	FindByID(ctx context.Context, id string) (*User, error)
	TouchLogin(ctx context.Context, userID string) error
	UpdateAvatarURL(ctx context.Context, userID, avatarURL string) error
}
