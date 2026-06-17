const RESEND_URL = "https://api.resend.com/emails";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/** Sends via Resend. Never throws — logs and returns success flag. */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!apiKey) {
    console.info("[email] RESEND_API_KEY not set — skipping send.");
    return false;
  }

  if (!from) {
    console.warn("[email] EMAIL_FROM not set — skipping send.");
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
