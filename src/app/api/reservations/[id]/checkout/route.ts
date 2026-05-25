import { NextResponse } from "next/server";
import { getGuestReservationPaymentView } from "@/lib/reservations/guest-payment";
import { createReservationCheckoutSession } from "@/lib/stripe/checkout";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const view = await getGuestReservationPaymentView(id);
    if (!view) {
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }

    if (view.isPaid) {
      return NextResponse.json(
        { error: "This reservation is already paid.", alreadyPaid: true },
        { status: 409 },
      );
    }

    if (!view.canPay) {
      return NextResponse.json(
        {
          error: view.isPendingReview
            ? "Your request is still under review. We will email you when it is approved."
            : "Online payment is not available for this reservation.",
        },
        { status: 400 },
      );
    }

    const result = await createReservationCheckoutSession(id);
    return NextResponse.json({
      checkoutUrl: result.checkoutUrl,
      sessionId: result.sessionId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
