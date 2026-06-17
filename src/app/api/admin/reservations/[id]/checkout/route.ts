import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, AdminAuthError } from "@/lib/admin/auth";
import { createReservationCheckoutSession } from "@/lib/stripe/checkout";
import { getGuestPaymentPageUrl } from "@/lib/stripe/payment-links";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminRequest(request);
    const { id } = await params;
    const result = await createReservationCheckoutSession(id);
    return NextResponse.json({
      checkoutUrl: result.checkoutUrl,
      sessionId: result.sessionId,
      guestPaymentUrl: getGuestPaymentPageUrl(id),
      reservation: result.reservation,
    });
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : "Checkout failed.";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
