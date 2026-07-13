/** Returns a trimmed avatar URL when present, otherwise null for initials fallback. */
export function resolveUserAvatarUrl(avatarUrl?: string | null): string | null {
  const trimmed = avatarUrl?.trim();
  return trimmed ? trimmed : null;
}
