ALTER TABLE users
  DROP COLUMN IF EXISTS last_login_at,
  DROP COLUMN IF EXISTS email_verified_at,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS password_hash;

DROP TYPE IF EXISTS user_status;
