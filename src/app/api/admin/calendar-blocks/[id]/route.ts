import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, AdminAuthError } from "@/lib/admin/auth";
import { deleteCalendarBlock } from "@/lib/reservations";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminRequest(request);
    const { id } = await params;
    await deleteCalendarBlock(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : "Could not delete calendar block.";
    const status = message.includes("not found") ? 404 : 500;
    console.error("[admin/calendar-blocks]", err);
    return NextResponse.json({ error: message }, { status });
  }
}
