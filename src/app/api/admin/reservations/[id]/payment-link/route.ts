import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, AdminAuthError } from "@/lib/admin/auth";
import { getReservationById } from "@/lib/reservations";
import { retrieveCheckoutUrl } from "@/lib/stripe/checkout";

function appOrigin(): string {
  return (process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000").replace(/\/$/, "");
}

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

    let checkoutUrl: string | null = null;
    if (row.stripeCheckoutSessionId) {
      checkoutUrl = await retrieveCheckoutUrl(row.stripeCheckoutSessionId);
    }

    if (!checkoutUrl) {
      checkoutUrl = `${appOrigin()}/reservations/${id}/payment`;
    }

    // Prefer guest payment hub; Stripe URL used when session is open

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : "Could not resolve payment link.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
