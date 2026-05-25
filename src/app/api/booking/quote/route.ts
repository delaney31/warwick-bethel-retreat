import { NextResponse } from "next/server";
import { computeStayQuote, parseQuoteBody } from "@/lib/server/booking";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseQuoteBody(body);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = computeStayQuote(
      parsed.checkIn,
      parsed.checkOut,
      parsed.guestCount,
      parsed.roomPackage,
    );
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
