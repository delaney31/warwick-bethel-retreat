import { normalizeToApiBase, tryNormalizeApiBase } from "@/lib/api/resolve-api-url";

function isProd(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

/** Server-only ASP.NET API base URL (ends with `/api`). */
export function getServerApiBaseUrl(): string {
  const env = process.env;
  const candidates = [
    env.INTERNAL_API_URL,
    env.NEXT_PUBLIC_API_BASE_URL,
    env.NEXT_PUBLIC_API_URL,
  ];
  for (const raw of candidates) {
    const base = tryNormalizeApiBase(raw, isProd());
    if (base) return base;
  }
  if (!isProd()) {
    return normalizeToApiBase("http://localhost:5002");
  }
  throw new Error(
    "Reservation API is not configured. Set INTERNAL_API_URL or NEXT_PUBLIC_API_BASE_URL to your Render API URL.",
  );
}

export async function backendFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; ok: true } | { ok: false; status: number; body: unknown }> {
  const base = getServerApiBaseUrl().replace(/\/$/, "");
  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { ok: false, status: res.status, body };
  }

  if (res.status === 204) {
    return { data: undefined as T, ok: true };
  }

  return { data: (await res.json()) as T, ok: true };
}
