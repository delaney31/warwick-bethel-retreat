import { NextResponse } from "next/server";
import { getGuestReservationPaymentView } from "@/lib/reservations/guest-payment";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const view = await getGuestReservationPaymentView(id);
    if (!view) {
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }
    return NextResponse.json({ reservation: view });
  } catch {
    return NextResponse.json({ error: "Could not load reservation." }, { status: 500 });
  }
}
