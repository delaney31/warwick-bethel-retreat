import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, AdminAuthError } from "@/lib/admin/auth";
import {
  createCalendarBlock,
  getCalendarBlocksInRange,
  listCalendarBlocks,
} from "@/lib/reservations";

export async function GET(request: NextRequest) {
  try {
    await requireAdminRequest(request);
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from")?.trim();
    const to = searchParams.get("to")?.trim();

    const blocks =
      from && to ? await getCalendarBlocksInRange(from, to) : await listCalendarBlocks();

    return NextResponse.json(blocks);
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[admin/calendar-blocks]", err);
    return NextResponse.json({ error: "Could not load calendar blocks." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminRequest(request);
    const body = (await request.json()) as {
      startDate?: string;
      endDate?: string;
      reason?: string;
    };

    const startDate = String(body.startDate ?? "").trim();
    const endDate = String(body.endDate ?? "").trim();
    const reason = String(body.reason ?? "").trim();

    if (!startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "startDate, endDate, and reason are required." },
        { status: 400 },
      );
    }

    const block = await createCalendarBlock({ startDate, endDate, reason });
    return NextResponse.json(block, { status: 201 });
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : "Could not create calendar block.";
    const status = message.includes("after") || message.includes("overlap") ? 409 : 500;
    console.error("[admin/calendar-blocks]", err);
    return NextResponse.json({ error: message }, { status });
  }
}
