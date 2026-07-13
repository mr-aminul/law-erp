-- Auth columns on users (password login; Google OAuth links come later).

CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended');

ALTER TABLE users
  ADD COLUMN password_hash TEXT,
  ADD COLUMN status user_status NOT NULL DEFAULT 'pending',
  ADD COLUMN email_verified_at TIMESTAMPTZ,
  ADD COLUMN last_login_at TIMESTAMPTZ;

COMMENT ON COLUMN users.password_hash IS
  'NULL for invite-pending or Google-only users until password is set.';
