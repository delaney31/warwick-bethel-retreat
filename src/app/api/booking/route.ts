import { NextResponse } from "next/server";
import { createRetreatReservation, parseBookingBody } from "@/lib/server/booking";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = parseBookingBody(body);
    if ("error" in payload) {
      return NextResponse.json({ error: payload.error }, { status: 400 });
    }

    const result = await createRetreatReservation(payload);
    if ("error" in result) {
      const status = result.fields?.length ? 400 : 409;
      return NextResponse.json(
        { error: result.error, fields: result.fields },
        { status },
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[booking]", err);
    return NextResponse.json(
      {
        error:
          "We couldn't submit your request. Please check your details and try again.",
      },
      { status: 500 },
    );
  }
}
