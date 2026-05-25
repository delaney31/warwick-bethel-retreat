import { getApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import type { AdminLoginResponse } from "./types";
import { setAccessToken } from "./token";

/**
 * Login against POST /api/admin/auth/login (no Authorization header).
 */
export async function loginAdmin(
  email: string,
  password: string,
  signal?: AbortSignal,
): Promise<AdminLoginResponse> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const res = await fetch(`${base}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    signal,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, body);
  }

  const data = body as AdminLoginResponse;
  if (!data?.accessToken) {
    throw new Error("Invalid login response.");
  }

  setAccessToken(data.accessToken);
  return data;
}
