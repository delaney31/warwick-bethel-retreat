import { NextResponse } from "next/server";
import { checkRetreatAvailability, parseBookingBody } from "@/lib/server/booking";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = parseBookingBody(body);
    if ("error" in payload) {
      return NextResponse.json({ error: payload.error }, { status: 400 });
    }

    if (!payload.checkIn || !payload.checkOut) {
      return NextResponse.json(
        { error: "Check-in and check-out dates are required." },
        { status: 400 },
      );
    }

    const result = await checkRetreatAvailability(payload.checkIn, payload.checkOut);
    if ("error" in result) {
      return NextResponse.json(
        {
          error: result.error,
          softFail: true,
          isAvailable: true,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error:
          "We could not verify dates right now. You may still submit your request — our host will confirm availability.",
        softFail: true,
      },
      { status: 200 },
    );
  }
}
