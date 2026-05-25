import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, AdminAuthError } from "@/lib/admin/auth";
import { getReservationById } from "@/lib/reservations";
import { resolveGuestPaymentLinks } from "@/lib/stripe/payment-links";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminRequest(request);
    const { id } = await params;
    const row = await getReservationById(id);
    if (!row) {
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }

    const links = await resolveGuestPaymentLinks(id);
    return NextResponse.json({
      guestPaymentUrl: links.guestPaymentUrl,
      stripeCheckoutUrl: links.stripeCheckoutUrl,
      /** Prefer guest hub for email/SMS; Stripe URL for direct pay. */
      checkoutUrl: links.stripeCheckoutUrl ?? links.guestPaymentUrl,
    });
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : "Could not resolve payment link.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
