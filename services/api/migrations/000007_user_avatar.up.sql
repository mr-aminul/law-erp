-- Google OAuth profile image URL (updated on each Google sign-in).

ALTER TABLE users
  ADD COLUMN avatar_url TEXT;

COMMENT ON COLUMN users.avatar_url IS
  'Profile image URL from Google OAuth or future avatar upload.';
