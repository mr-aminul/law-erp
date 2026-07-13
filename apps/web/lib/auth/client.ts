export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  firm: {
    id: string;
    name: string;
    slug: string;
  };
};

export type LoginResponse = {
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};

const API_BASE = "/api";

export async function fetchGoogleAuthEnabled(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/auth/google/enabled`, {
      credentials: "include",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return false;
    const body = (await response.json()) as { enabled?: boolean };
    return body.enabled === true;
  } catch {
    return false;
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error ?? "Login failed");
  }

  return body as LoginResponse;
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getMe(): Promise<AuthUser | null> {
  const response = await fetch(`${API_BASE}/auth/me`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load session");
  }

  const body = (await response.json()) as MeResponse;
  return body.user;
}

export function getServerApiBase(): string {
  return process.env.API_INTERNAL_URL ?? "http://localhost:8080";
}

export async function getMeServer(cookieHeader: string | undefined): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${getServerApiBase()}/auth/me`, {
      headers: {
        Accept: "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as MeResponse;
    return body.user;
  } catch {
    return null;
  }
}
