package store

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrUserNotFound = errors.New("user not found")

type User struct {
	ID        string
	FirmID    string
	FirmName  string
	FirmSlug  string
	Email     string
	FullName  string
	Role      string
	Status    string
	Password  string
	AvatarURL string
}

type UserStore struct {
	pool *pgxpool.Pool
}

func NewUserStore(pool *pgxpool.Pool) *UserStore {
	return &UserStore{pool: pool}
}

func (s *UserStore) FindByEmail(ctx context.Context, email string) (*User, error) {
	const q = `
		SELECT u.id, u.firm_id, f.name, f.slug, u.email, u.full_name, u.role, u.status, u.password_hash,
		       COALESCE(u.avatar_url, '')
		FROM users u
		JOIN firms f ON f.id = u.firm_id
		WHERE u.email = $1
		  AND u.deleted_at IS NULL
		  AND f.deleted_at IS NULL
		LIMIT 1
	`

	var u User
	err := s.pool.QueryRow(ctx, q, email).Scan(
		&u.ID, &u.FirmID, &u.FirmName, &u.FirmSlug,
		&u.Email, &u.FullName, &u.Role, &u.Status, &u.Password, &u.AvatarURL,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, err
	}

	return &u, nil
}

func (s *UserStore) FindByID(ctx context.Context, id string) (*User, error) {
	const q = `
		SELECT u.id, u.firm_id, f.name, f.slug, u.email, u.full_name, u.role, u.status, u.password_hash,
		       COALESCE(u.avatar_url, '')
		FROM users u
		JOIN firms f ON f.id = u.firm_id
		WHERE u.id = $1
		  AND u.deleted_at IS NULL
		  AND f.deleted_at IS NULL
	`

	var u User
	err := s.pool.QueryRow(ctx, q, id).Scan(
		&u.ID, &u.FirmID, &u.FirmName, &u.FirmSlug,
		&u.Email, &u.FullName, &u.Role, &u.Status, &u.Password, &u.AvatarURL,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, err
	}

	return &u, nil
}

func (s *UserStore) TouchLogin(ctx context.Context, userID string) error {
	_, err := s.pool.Exec(ctx, `UPDATE users SET last_login_at = $2 WHERE id = $1`, userID, time.Now())
	return err
}

func (s *UserStore) UpdateAvatarURL(ctx context.Context, userID, avatarURL string) error {
	tag, err := s.pool.Exec(ctx, `
		UPDATE users
		SET avatar_url = $2, updated_at = now()
		WHERE id = $1 AND deleted_at IS NULL
	`, userID, avatarURL)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrUserNotFound
	}
	return nil
}

// Dev seed constants — stable IDs for local development.
const (
	DevFirmID  = "11111111-1111-4111-8111-111111111101"
	DevUserID  = "11111111-1111-4111-8111-111111111102"
	DevUserID2 = "11111111-1111-4111-8111-111111111103"
)

func (s *UserStore) SeedDev(ctx context.Context, email, fullName, passwordHash string) error {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	_, err = tx.Exec(ctx, `
		INSERT INTO firms (id, name, slug, country_code)
		VALUES ($1, 'Law ERP Development', 'law-erp-dev', 'BD')
		ON CONFLICT (slug) DO NOTHING
	`, DevFirmID)
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx, `
		INSERT INTO users (id, firm_id, email, full_name, role, status, password_hash, email_verified_at)
		VALUES ($1, $2, $3, $4, 'firm_owner', 'active', $5, now())
		ON CONFLICT (firm_id, email) DO UPDATE SET
			full_name = EXCLUDED.full_name,
			role = EXCLUDED.role,
			status = EXCLUDED.status,
			password_hash = EXCLUDED.password_hash,
			updated_at = now()
	`, DevUserID, DevFirmID, email, fullName, passwordHash)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (s *UserStore) UpsertDevUser(ctx context.Context, userID, email, fullName, role, passwordHash string) error {
	_, err := s.pool.Exec(ctx, `
		INSERT INTO users (id, firm_id, email, full_name, role, status, password_hash, email_verified_at)
		VALUES ($1, $2, $3, $4, $5, 'active', $6, now())
		ON CONFLICT (firm_id, email) DO UPDATE SET
			full_name = EXCLUDED.full_name,
			role = EXCLUDED.role,
			status = EXCLUDED.status,
			password_hash = EXCLUDED.password_hash,
			updated_at = now()
	`, userID, DevFirmID, email, fullName, role, passwordHash)
	return err
}
