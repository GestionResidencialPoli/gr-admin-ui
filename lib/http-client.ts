const CSRF_COOKIE = "XSRF-TOKEN";
const CSRF_HEADER = "X-XSRF-TOKEN";
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`La API respondió con estado ${status}`);
  }
}

type Listener = () => void;
const sessionExpiredListeners = new Set<Listener>();

export function onSessionExpired(listener: Listener): () => void {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie(): Promise<string | null> {
  const existing = readCookie(CSRF_COOKIE);
  if (existing) return existing;

  await fetch("/api/v1/auth/me", { credentials: "include" }).catch(() => undefined);
  return readCookie(CSRF_COOKIE);
}

async function refreshSession(): Promise<boolean> {
  const csrf = await ensureCsrfCookie();
  const response = await fetch("/api/v1/auth/refresh", {
    method: "POST",
    headers: csrf ? { [CSRF_HEADER]: csrf } : undefined,
    credentials: "include",
  });
  return response.ok;
}

export async function apiFetch<T = void>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers);

  if (MUTATING_METHODS.has(method)) {
    const csrf = await ensureCsrfCookie();
    if (csrf) headers.set(CSRF_HEADER, csrf);
  }

  const request = { ...init, method, headers, credentials: "include" as const };
  let response = await fetch(path, request);

  if (response.status === 401 && !path.startsWith("/api/v1/auth/refresh")) {
    if (await refreshSession()) response = await fetch(path, request);
  }

  if (response.status === 401) sessionExpiredListeners.forEach((listener) => listener());

  if (!response.ok) {
    throw new ApiClientError(response.status, await response.json().catch(() => null));
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
