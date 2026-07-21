/** Brand seed + appearance (light / dark / system) */

export const THEME_COLOR_KEY = "ukil-theme-color";
export const APPEARANCE_KEY = "ukil-appearance";
export const DEFAULT_THEME_COLOR = "#123f2f";

export type AppearanceMode = "light" | "dark" | "system";

export const THEME_BOOTSTRAP = `(function(){try{var d=document.documentElement;var t=localStorage.getItem(${JSON.stringify(THEME_COLOR_KEY)});if(t&&/^#[0-9A-Fa-f]{6}$/.test(t))d.style.setProperty("--color-theme",t.toLowerCase());var a=localStorage.getItem(${JSON.stringify(APPEARANCE_KEY)})||"system";var dark=a==="dark"||(a!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches);d.classList.toggle("dark",dark);d.style.colorScheme=dark?"dark":"light"}catch(e){}})();`;

/** @deprecated use THEME_BOOTSTRAP */
export const THEME_COLOR_BOOTSTRAP = THEME_BOOTSTRAP;

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

export function normalizeAppearance(value: string | null): AppearanceMode {
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
}

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveDark(mode: AppearanceMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return systemPrefersDark();
}

export function applyAppearance(mode: AppearanceMode): AppearanceMode {
  if (typeof document === "undefined") return mode;
  const next = normalizeAppearance(mode);
  const dark = resolveDark(next);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  localStorage.setItem(APPEARANCE_KEY, next);
  return next;
}

export function readAppearance(): AppearanceMode {
  if (typeof document === "undefined") return "system";
  return normalizeAppearance(localStorage.getItem(APPEARANCE_KEY));
}

/** Keep .dark in sync when OS preference changes and mode is system. */
export function watchSystemAppearance(): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (readAppearance() === "system") applyAppearance("system");
  };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
