import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "wbr_host_session";
const SESSION_VERSION = "v1";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getAdminSecret(): string {
  const secret = process.env.ADMIN_PASSWORD?.trim();
  if (!secret || secret.length < 8) {
    throw new Error("ADMIN_PASSWORD is not configured (min 8 characters).");
  }
  return secret;
}

async function hmacSign(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Buffer.from(sig).toString("base64url");
}

export async function createSessionToken(): Promise<string> {
  const secret = getAdminSecret();
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = `${SESSION_VERSION}:${exp}`;
  const sig = await hmacSign(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token?.includes(".")) return false;
  const secret = process.env.ADMIN_PASSWORD?.trim();
  if (!secret || secret.length < 8) return false;
  try {
    const [payload, sig] = token.split(".") as [string, string];
    const expected = await hmacSign(secret, payload);
    if (sig.length !== expected.length) return false;
    let match = 0;
    for (let i = 0; i < sig.length; i++) match |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    if (match !== 0) return false;
    const [, expStr] = payload.split(":");
    const exp = Number(expStr);
    return Number.isFinite(exp) && Date.now() < exp;
  } catch {
    return false;
  }
}

/** Constant-time compare (Edge-safe). */
export function verifyAdminPassword(password: string): boolean {
  try {
    const expected = getAdminSecret();
    if (password.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= password.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

export async function getSessionTokenFromRequest(request: NextRequest): Promise<string | null> {
  return request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export async function isAdminRequestAuthenticated(request: NextRequest): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD?.trim()) return false;
  const token = await getSessionTokenFromRequest(request);
  return verifySessionToken(token);
}

export async function requireAdminRequest(request: NextRequest): Promise<void> {
  if (!(await isAdminRequestAuthenticated(request))) {
    throw new AdminAuthError();
  }
}

export class AdminAuthError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AdminAuthError";
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

export async function readAdminSessionFromCookies(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_SESSION_COOKIE)?.value);
}
