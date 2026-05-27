import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, AdminAuthError } from "@/lib/admin/auth";
import { sendTestHostSms } from "@/lib/sms/twilio-host";

export async function POST(request: NextRequest) {
  try {
    await requireAdminRequest(request);
    const { sent, detail } = await sendTestHostSms();
    return NextResponse.json({
      sent,
      detail,
      message: sent
        ? "Test SMS sent."
        : detail ?? "SMS was not sent. Check logs and environment variables.",
    });
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[admin/test-sms]", err);
    return NextResponse.json({ error: "Could not send test SMS." }, { status: 500 });
  }
}
