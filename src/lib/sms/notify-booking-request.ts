import { SITE_NAME } from "@/lib/content/brand";
import { resolveHostAlertEmail, sendEmail } from "@/lib/email/resend";
import { getStayPackageLabel, type StayPackageId } from "@/lib/pricing/stay-packages";
import { getAppUrl } from "@/config/env";
import { sendHostSms } from "@/lib/sms/twilio-host";

export interface NewBookingSmsInput {
  guestName: string;
  guestEmail: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  roomPackage: StayPackageId;
  reservationId?: string;
}

/** Fire-and-forget safe: never throws. */
export async function notifyHostNewBookingRequest(input: NewBookingSmsInput): Promise<void> {
  const packageLabel = getStayPackageLabel(input.roomPackage);
  const body =
    `${SITE_NAME}: New booking request. ` +
    `${input.checkIn}–${input.checkOut} (${input.nights}n, ${packageLabel}). ` +
    `Guest: ${input.guestName}, ${input.phone}. Review in admin.`;

  await sendHostSms(body);
  await sendHostBookingEmail(input, packageLabel);
}

async function sendHostBookingEmail(
  input: NewBookingSmsInput,
  packageLabel: string,
): Promise<void> {
  const to = resolveHostAlertEmail();
  const adminUrl = `${getAppUrl()}/admin/reservations`;
  const subject = `New stay request — ${input.checkIn} to ${input.checkOut}`;
  const text = [
    `New ${SITE_NAME} booking request`,
    "",
    `Dates: ${input.checkIn} → ${input.checkOut} (${input.nights} nights)`,
    `Stay option: ${packageLabel}`,
    `Guests: ${input.guestCount}`,
    `Guest: ${input.guestName}`,
    `Email: ${input.guestEmail}`,
    `Phone: ${input.phone}`,
    input.reservationId ? `Reference: ${input.reservationId}` : null,
    "",
    `Review in admin: ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const html = `
    <p><strong>New ${esc(SITE_NAME)} booking request</strong></p>
    <ul>
      <li><strong>Dates:</strong> ${esc(input.checkIn)} → ${esc(input.checkOut)} (${input.nights} nights)</li>
      <li><strong>Stay option:</strong> ${esc(packageLabel)}</li>
      <li><strong>Guests:</strong> ${input.guestCount}</li>
      <li><strong>Guest:</strong> ${esc(input.guestName)}</li>
      <li><strong>Email:</strong> ${esc(input.guestEmail)}</li>
      <li><strong>Phone:</strong> ${esc(input.phone)}</li>
      ${input.reservationId ? `<li><strong>Reference:</strong> ${esc(input.reservationId)}</li>` : ""}
    </ul>
    <p><a href="${adminUrl}">Review in admin</a></p>
  `.trim();

  await sendEmail({ to, subject, html, text });
}
