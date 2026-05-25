import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, AdminAuthError } from "@/lib/admin/auth";
import { ReservationDbStatus, serializeReservation, updateReservationStatus } from "@/lib/reservations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminRequest(request);
    const { id } = await params;
    const body = (await request.json()) as {
      status?: string;
      stripeCheckoutSessionId?: string | null;
      stripePaymentIntentId?: string | null;
    };

    if (!body.status || !(body.status in ReservationDbStatus)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const updated = await updateReservationStatus(
      id,
      body.status as ReservationDbStatus,
      {
        stripeCheckoutSessionId: body.stripeCheckoutSessionId,
        stripePaymentIntentId: body.stripePaymentIntentId,
      },
    );

    return NextResponse.json(serializeReservation(updated));
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : "Update failed.";
    const status = message.includes("not found")
      ? 404
      : message.includes("overlap") || message.includes("Cannot")
        ? 409
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
