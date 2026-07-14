export const THEME_COLOR_KEY = "ukil-theme-color";
export const DEFAULT_THEME_COLOR = "#123f2f";

export const THEME_COLOR_BOOTSTRAP = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_COLOR_KEY)});if(t&&/^#[0-9A-Fa-f]{6}$/.test(t))document.documentElement.style.setProperty("--color-theme",t.toLowerCase())}catch(e){}})();`;

export function normalizeThemeColor(value: string): string | null {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toLowerCase();
  if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) return `#${trimmed.toLowerCase()}`;
  return null;
}

export function applyThemeColor(hex: string): string | null {
  const next = normalizeThemeColor(hex);
  if (!next || typeof document === "undefined") return null;
  document.documentElement.style.setProperty("--color-theme", next);
  localStorage.setItem(THEME_COLOR_KEY, next);
  return next;
}

export function readThemeColor(): string {
  if (typeof document === "undefined") return DEFAULT_THEME_COLOR;
  const stored = localStorage.getItem(THEME_COLOR_KEY);
  const fromStore = stored ? normalizeThemeColor(stored) : null;
  if (fromStore) return fromStore;
  const inline = document.documentElement.style
    .getPropertyValue("--color-theme")
    .trim();
  return normalizeThemeColor(inline) ?? DEFAULT_THEME_COLOR;
}
