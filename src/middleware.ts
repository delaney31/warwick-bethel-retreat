import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/rooms", "/gallery", "/availability", "/book", "/faq", "/contact", "/reservations", "/api", "/admin/login"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublicPath(pathname) || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
