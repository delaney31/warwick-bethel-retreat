import { SITE_CONTACT_EMAIL, SITE_NAME } from "@/lib/content/brand";
import { CHECK_IN_OUT_NOTE } from "@/lib/content/policies";
import { sendEmail } from "@/lib/email/resend";
import { getStayPackageLabel, type StayPackageId } from "@/lib/pricing/stay-packages";
import { getAppUrl } from "@/config/env";

export interface GuestBookingEmailInput {
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  roomPackage: StayPackageId;
  reservationId: string;
}

/** Fire-and-forget safe: never throws. */
export async function notifyGuestBookingRequestReceived(
  input: GuestBookingEmailInput,
): Promise<void> {
  const packageLabel = getStayPackageLabel(input.roomPackage);
  const firstName = input.guestName.trim().split(/\s+/)[0] || "there";
  const subject = `We received your ${SITE_NAME} stay request`;
  const policiesUrl = `${getAppUrl()}/policies`;

  const text = [
    `Hi ${firstName},`,
    "",
    `Thank you for requesting a stay at ${SITE_NAME} near Warwick Bethel.`,
    "",
    `Dates: ${input.checkIn} → ${input.checkOut} (${input.nights} nights)`,
    `Stay option: ${packageLabel}`,
    `Guests: ${input.guestCount}`,
    `Reference: ${input.reservationId}`,
    "",
    "What happens next:",
    "1. Your host personally reviews your request (usually within a few hours on business days).",
    "2. If approved, you will receive a secure Stripe payment link — no charge until then.",
    "3. After payment, we send arrival details for check-in.",
    "",
    CHECK_IN_OUT_NOTE,
    "",
    `Policies: ${policiesUrl}`,
    "",
    `Questions? Reply to this email or contact ${SITE_CONTACT_EMAIL}.`,
  ].join("\n");

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const html = `
    <p>Hi ${esc(firstName)},</p>
    <p>Thank you for requesting a stay at <strong>${esc(SITE_NAME)}</strong> near Warwick Bethel.</p>
    <ul>
      <li><strong>Dates:</strong> ${esc(input.checkIn)} → ${esc(input.checkOut)} (${input.nights} nights)</li>
      <li><strong>Stay option:</strong> ${esc(packageLabel)}</li>
      <li><strong>Guests:</strong> ${input.guestCount}</li>
      <li><strong>Reference:</strong> ${esc(input.reservationId)}</li>
    </ul>
    <p><strong>What happens next</strong></p>
    <ol>
      <li>Your host personally reviews your request (usually within a few hours on business days).</li>
      <li>If approved, you will receive a secure Stripe payment link — no charge until then.</li>
      <li>After payment, we send arrival details for check-in.</li>
    </ol>
    <p>${esc(CHECK_IN_OUT_NOTE)}</p>
    <p><a href="${policiesUrl}">View guest policies</a></p>
    <p>Questions? Reply to this email or contact <a href="mailto:${SITE_CONTACT_EMAIL}">${esc(SITE_CONTACT_EMAIL)}</a>.</p>
  `.trim();

  await sendEmail({
    to: input.guestEmail,
    subject,
    html,
    text,
  });
}
