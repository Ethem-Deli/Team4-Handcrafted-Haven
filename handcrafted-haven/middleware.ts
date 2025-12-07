import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Protect Seller Routes
  if (path.startsWith("/seller")) {
    if (!token) return NextResponse.redirect(new URL("/auth/signin", req.url));
    if (token.role !== "SELLER") return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect Customer Routes (future)
  if (path.startsWith("/customer")) {
    if (!token) return NextResponse.redirect(new URL("/auth/signin", req.url));
    if (token.role !== "CUSTOMER") return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/seller/:path*"],
};
