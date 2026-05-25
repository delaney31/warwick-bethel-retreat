/**
 * Shared API error handling.
 */

/** Thrown when API base URL is missing or invalid (e.g. misconfigured Vercel env). */
export class ApiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiConfigurationError";
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown,
  ) {
    super(`API ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

/**
 * Extract a user-friendly error message from API errors or validation responses.
 */
const PUBLIC_CONFIG_FALLBACK =
  "We couldn’t load vehicles right now. Please try again in a moment or open the full fleet.";

export function getApiErrorMessage(err: unknown): string {
  if (err instanceof ApiConfigurationError) {
    if (process.env.NODE_ENV === "development") {
      return err.message;
    }
    return PUBLIC_CONFIG_FALLBACK;
  }
  if (isApiError(err)) {
    const body = err.body as {
      error?: string;
      detail?: string;
      title?: string;
      errors?: Record<string, string[]>;
    } | null;
    if (body?.detail && typeof body.detail === "string") return body.detail;
    if (body?.error && typeof body.error === "string") return body.error;
    if (body?.errors && typeof body.errors === "object") {
      const first = Object.values(body.errors)[0];
      if (Array.isArray(first) && first[0]) return first[0];
    }
    if (err.status === 404) return "Not found.";
    if (err.status >= 500) return "Server error. Please try again later.";
    return err.statusText || "Request failed.";
  }
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred.";
}
