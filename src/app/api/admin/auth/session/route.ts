import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  const authenticated = await isAdminRequestAuthenticated(request);
  return NextResponse.json({ authenticated });
}
