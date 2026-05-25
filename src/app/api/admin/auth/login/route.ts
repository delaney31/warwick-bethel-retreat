import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password?.trim() ?? "";
    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid host password." }, { status: 401 });
    }

    const token = await createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed.";
    const status = message.includes("ADMIN_PASSWORD") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
