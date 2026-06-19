/** Published guest policies — keep aligned with FAQ and booking copy. */
export const CHECK_IN_TIME = "3:00 PM";
export const CHECK_OUT_TIME = "11:00 AM";

export const CHECK_IN_OUT_NOTE =
  `Standard check-in is after ${CHECK_IN_TIME} and check-out is before ${CHECK_OUT_TIME}. Early arrival or late departure may be possible when the calendar allows — mention it in your reservation notes.`;

export const CANCELLATION_POLICY = {
  title: "Cancellation",
  summary:
    "If your Bethel plans change, contact us as soon as you can. We handle each stay personally and aim to be fair.",
  bullets: [
    "Before your stay is approved: cancel anytime — there is no charge.",
    "After approval and payment: contact your host to discuss options. Refunds depend on how close you are to check-in and whether we can re-book the dates.",
    "No-shows are charged in full unless we agree otherwise in writing.",
  ],
};

export const HOUSE_RULES = {
  title: "House rules",
  bullets: [
    "Quiet hours after 10:00 PM — residential neighborhood.",
    "No smoking inside the cottage.",
    "No parties or events — this is a peaceful Bethel visitor stay.",
    "Maximum occupancy as booked (up to 6 guests when both bedrooms are reserved).",
    "Pets are not permitted unless agreed in writing before arrival.",
    "Washer and dryer are available on request — ask when booking.",
  ],
};

export const PRIVACY_POLICY = {
  title: "Privacy",
  summary:
    "We collect only what we need to review and host your stay — name, email, phone, dates, and any notes you provide.",
  bullets: [
    "Reservation details are used for hosting, payment (Stripe), and communication about your stay.",
    "We do not sell guest information.",
    "Payment card data is handled by Stripe — we do not store card numbers on our servers.",
    "Contact us at bookings@tuxedoretreat.com to ask about your reservation data.",
  ],
};
