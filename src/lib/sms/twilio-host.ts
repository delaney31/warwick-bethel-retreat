import { SITE_NAME } from "@/lib/content/brand";

function isSmsEnabled(): boolean {
  return process.env.ENABLE_TWILIO_SMS === "true";
}

function missingCredentials(): string[] {
  const missing: string[] = [];
  if (!process.env.TWILIO_ACCOUNT_SID?.trim()) missing.push("TWILIO_ACCOUNT_SID");
  if (!process.env.TWILIO_AUTH_TOKEN?.trim()) missing.push("TWILIO_AUTH_TOKEN");
  if (!process.env.TWILIO_FROM_NUMBER?.trim()) missing.push("TWILIO_FROM_NUMBER");
  if (!process.env.HOST_ALERT_PHONE?.trim()) missing.push("HOST_ALERT_PHONE");
  return missing;
}

async function postTwilioMessage(body: string): Promise<Response> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN!.trim();
  const from = process.env.TWILIO_FROM_NUMBER!.trim();
  const to = process.env.HOST_ALERT_PHONE!.trim();
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const params = new URLSearchParams({
    From: from,
    To: to,
    Body: body,
  });

  return fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
}

/** Sends host alert SMS. Never throws — logs and returns on failure. */
export async function sendHostSms(body: string): Promise<void> {
  const result = await sendHostSmsWithResult(body);
  if (!result.sent) {
    console.warn("[twilio-host]", result.detail ?? "SMS not sent");
  }
}

export async function sendHostSmsWithResult(
  body: string,
): Promise<{ sent: boolean; detail?: string }> {
  if (!isSmsEnabled()) {
    console.info('[twilio-host] SMS disabled (ENABLE_TWILIO_SMS is not "true") — skipping send.');
    return { sent: false, detail: "SMS disabled" };
  }

  const missing = missingCredentials();
  if (missing.length > 0) {
    console.warn(
      `[twilio-host] Twilio enabled but missing credentials: ${missing.join(", ")}`,
    );
    return { sent: false, detail: `Missing: ${missing.join(", ")}` };
  }

  try {
    const response = await postTwilioMessage(body);
    if (response.ok) return { sent: true };

    const err = await response.text();
    console.warn(`[twilio-host] Twilio failed (${response.status}):`, err);
    return { sent: false, detail: `Twilio HTTP ${response.status}` };
  } catch (err) {
    console.warn("[twilio-host] Twilio exception:", err);
    return {
      sent: false,
      detail: err instanceof Error ? err.message : "Twilio error",
    };
  }
}

export async function sendTestHostSms(): Promise<{ sent: boolean; detail?: string }> {
  const body = `Test SMS from ${SITE_NAME}. Twilio alerts are working.`;
  return sendHostSmsWithResult(body);
}
