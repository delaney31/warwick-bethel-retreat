import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, AdminAuthError } from "@/lib/admin/auth";
import { getEmailConfigStatus, resolveHostAlertEmail, sendEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  try {
    await requireAdminRequest(request);
    const configured = getEmailConfigStatus();

    if (!configured.hasResendApiKey || !configured.hasFrom) {
      return NextResponse.json({
        sent: false,
        configured,
        message:
          "Email not configured on Vercel. Set RESEND_API_KEY and EMAIL_FROM, then redeploy.",
      });
    }

    const to = resolveHostAlertEmail();
    const sent = await sendEmail({
      to,
      subject: "Tuxedo Retreat — test booking alert email",
      html: "<p>Tuxedo Retreat test email — booking alerts are wired up.</p>",
      text: "Tuxedo Retreat test email — booking alerts are wired up.",
    });

    return NextResponse.json({
      sent,
      configured,
      message: sent
        ? `Test email sent to ${to}. Check inbox and spam.`
        : "Resend rejected the send. Check Vercel function logs for the Resend error.",
    });
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[admin/test-email]", err);
    return NextResponse.json({ error: "Could not send test email." }, { status: 500 });
  }
}
