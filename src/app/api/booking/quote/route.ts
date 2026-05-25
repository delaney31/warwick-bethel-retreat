import { NextResponse } from "next/server";
import { computeQuote, parseBookingBody } from "@/lib/server/booking";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = parseBookingBody(body);
    if ("error" in payload) {
      return NextResponse.json({ error: payload.error }, { status: 400 });
    }

    const result = computeQuote(payload);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error, fields: result.fields },
        { status: 400 },
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Could not calculate your estimate. Please try again." },
      { status: 500 },
    );
  }
}
