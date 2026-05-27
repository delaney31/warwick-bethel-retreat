import { SITE_NAME } from "@/lib/content/brand";
import { getStayPackageLabel, type StayPackageId } from "@/lib/pricing/stay-packages";
import { sendHostSms } from "@/lib/sms/twilio-host";

export interface NewBookingSmsInput {
  guestName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  roomPackage: StayPackageId;
}

/** Fire-and-forget safe: never throws. */
export async function notifyHostNewBookingRequest(input: NewBookingSmsInput): Promise<void> {
  const packageLabel = getStayPackageLabel(input.roomPackage);
  const body =
    `${SITE_NAME}: New booking request. ` +
    `${input.checkIn}–${input.checkOut} (${input.nights}n, ${packageLabel}). ` +
    `Guest: ${input.guestName}, ${input.phone}. Review in admin.`;

  await sendHostSms(body);
}
