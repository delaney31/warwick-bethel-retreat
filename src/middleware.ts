import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin/auth";
import { isSeoLandingSlug } from "@/lib/content/seo-landings";
import { getCanonicalRedirectUrl } from "@/lib/server/canonical-host";

const PUBLIC_PATHS = [
  "/",
  "/rooms",
  "/gallery",
  "/availability",
  "/book",
  "/faq",
  "/contact",
  "/guides",
  "/reservations",
  "/api/booking",
  "/api/reservations",
  "/api/stripe/webhook",
  "/admin/login",
];

function isPublicPath(pathname: string): boolean {
  if (pathname.length > 1) {
    const slug = pathname.slice(1).split("/")[0];
    if (slug && pathname === `/${slug}` && isSeoLandingSlug(slug)) {
      return true;
    }
  }
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const canonicalRedirect = getCanonicalRedirectUrl(request);
  if (canonicalRedirect) {
    return NextResponse.redirect(canonicalRedirect, 308);
  }

  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin/auth/login")) {
    return NextResponse.next();
  }

  const needsAdmin =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!needsAdmin) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const ok = await isAdminRequestAuthenticated(request);
  if (!ok) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|robots\\.txt|sitemap\\.xml|googlec00b9150749578dc\\.html).*)",
  ],
};

