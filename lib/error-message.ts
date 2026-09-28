import { ApiClientError } from "@gestionresidencial/auth-client";

export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError && error.body && typeof error.body === "object" && "message" in error.body) {
    const message = (error.body as { message?: string }).message;
    if (message) return message;
  }
  return fallback;
}
