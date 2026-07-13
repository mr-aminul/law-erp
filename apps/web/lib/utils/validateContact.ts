/** Optional contact fields: empty is valid; non-empty must match format. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return EMAIL_RE.test(trimmed);
}

/** Accepts BD (+880…) and general international digit formats. */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return false;
  if (digits.startsWith("880")) return digits.length >= 12 && digits.length <= 13;
  if (digits.startsWith("01")) return digits.length === 11;
  return true;
}

export function emailError(value: string): string | null {
  if (!value.trim()) return null;
  return isValidEmail(value) ? null : "Enter a valid email address";
}

export function phoneError(value: string): string | null {
  if (!value.trim()) return null;
  return isValidPhone(value)
    ? null
    : "Enter a valid phone number (e.g. +880 1XXX-XXXXXX)";
}
