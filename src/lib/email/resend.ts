const RESEND_URL = "https://api.resend.com/emails";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailConfigStatus {
  hasResendApiKey: boolean;
  hasFrom: boolean;
  from: string | null;
  hostAlertEmail: string;
}

function readResendApiKey(): string | undefined {
  return (
    process.env.RESEND_API_KEY?.trim() ||
    process.env.Email__ResendApiKey?.trim() ||
    undefined
  );
}

function readEmailFrom(): string | undefined {
  return (
    process.env.EMAIL_FROM?.trim() ||
    process.env.Email__From?.trim() ||
    undefined
  );
}

export function getEmailConfigStatus(): EmailConfigStatus {
  const from = readEmailFrom();
  return {
    hasResendApiKey: Boolean(readResendApiKey()),
    hasFrom: Boolean(from),
    from: from ?? null,
    hostAlertEmail: resolveHostAlertEmail(),
  };
}

/** Sends via Resend. Never throws — logs and returns success flag. */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const apiKey = readResendApiKey();
  const from = readEmailFrom();

  if (!apiKey) {
    console.warn(
      "[email] Resend API key not set — set RESEND_API_KEY on Vercel. Skipping send.",
    );
    return false;
  }

  if (!from) {
    console.warn(
      "[email] EMAIL_FROM not set — use e.g. Tuxedo Retreat <stays@pacificluxrentals.com>. Skipping send.",
    );
    return false;
  }

  const payload: Record<string, unknown> = {
    from,
    to: [input.to],
    subject: input.subject,
    html: input.html,
  };
  if (input.text) payload.text = input.text;

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      console.warn(`[email] Resend failed (${response.status}):`, body);
      return false;
    }

    console.info(`[email] Sent to ${input.to} — ${input.subject}`);
    return true;
  } catch (err) {
    console.warn("[email] Resend exception:", err);
    return false;
  }
}

export function resolveHostAlertEmail(): string {
  const host = process.env.HOST_ALERT_EMAIL?.trim();
  if (host) return host;
  const admin = process.env.ADMIN_EMAIL?.trim();
  if (admin) return admin;
  return "pacificluxerentals@gmail.com";
}
