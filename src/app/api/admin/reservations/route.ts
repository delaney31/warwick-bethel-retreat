import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, AdminAuthError } from "@/lib/admin/auth";
import {
  ReservationDbStatus,
  getReservations,
  serializeReservation,
} from "@/lib/reservations";

export async function GET(request: NextRequest) {
  try {
    await requireAdminRequest(request);
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status")?.trim();
    const status =
      statusParam && statusParam in ReservationDbStatus
        ? (statusParam as ReservationDbStatus)
        : undefined;

    const rows = await getReservations(status);
    return NextResponse.json(
      rows.map((r) => serializeReservation(r)).filter((r) => r !== null),
    );
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Could not load reservations." },
      { status: 500 },
    );
  }
}
