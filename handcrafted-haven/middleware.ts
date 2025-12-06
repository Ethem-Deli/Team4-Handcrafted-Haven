import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const path = req.nextUrl.pathname;

  let user = null;

  if (session) {
    try {
      user = JSON.parse(session);
    } catch (err) {
      console.error("Invalid session cookie");
    }
  }

  // PROTECT SELLER ROUTES //
    if (path.startsWith("/seller")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (user.role !== "seller") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // PROTECT CUSTOMER ROUTES //

  if (path.startsWith("/customer")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (user.role !== "customer") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/seller/:path*", "/api/seller/:path*"],
};