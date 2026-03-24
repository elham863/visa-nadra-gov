import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "visa_admin_auth";
const POWER_TEXT_ROUTE = "/power-off";

function isExemptFromPowerOff(pathname: string): boolean {
  return (
    pathname === POWER_TEXT_ROUTE ||
    pathname === "/admin/change/power" ||
    pathname.startsWith("/api/power")
  );
}

async function isPowerOn(request: NextRequest): Promise<boolean> {
  try {
    const statusUrl = new URL("/api/power/status", request.url);
    const res = await fetch(statusUrl, {
      method: "GET",
      cache: "no-store"
    });
    if (!res.ok) {
      return true;
    }
    const data = (await res.json()) as { powerOn?: boolean };
    return data.powerOn !== false;
  } catch {
    return true;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Global kill switch: show only one text on all pages when app is OFF.
  if (
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/favicon") &&
    !pathname.match(/\.[a-zA-Z0-9]+$/) &&
    !isExemptFromPowerOff(pathname)
  ) {
    const powerOn = await isPowerOn(request);
    if (!powerOn) {
      return NextResponse.redirect(new URL(POWER_TEXT_ROUTE, request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    const isLoginPage = pathname === "/admin" || pathname === "/admin/login";

    if (isLoginPage) {
      if (cookie === "true" && pathname === "/admin/login") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (cookie !== "true") {
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

