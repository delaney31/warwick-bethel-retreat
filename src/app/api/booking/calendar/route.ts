import { NextResponse } from "next/server";
import { getRetreatCalendar } from "@/lib/server/booking";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from")?.trim() ?? "";
    const to = searchParams.get("to")?.trim() ?? "";

    if (!from || !to) {
      return NextResponse.json(
        { error: "from and to query parameters are required." },
        { status: 400 },
      );
    }

    const result = await getRetreatCalendar(from, to);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Could not load the calendar. Please try again." },
      { status: 500 },
    );
  }
}
