import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "visa_admin_auth";
const POWER_TEXT_ROUTE = "/power-off";

/** Avoid missing exemptions when URL has a trailing slash or odd casing from proxies. */
function normalizePathname(pathname: string): string {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function isExemptFromPowerOff(pathname: string): boolean {
  const p = normalizePathname(pathname);
  return (
    p === POWER_TEXT_ROUTE ||
    p === "/admin/change/power" ||
    p.startsWith("/admin/change/power/") ||
    pathname.startsWith("/api/power")
  );
}

async function isPowerOn(request: NextRequest): Promise<boolean> {
  try {
    // Use origin only (not full request.url) so the status URL is stable.
    // Cache-bust every call: Next.js can still associate internal fetches with the
    // Data Cache; a unique query string avoids stale { powerOn: false } after toggling ON.
    const statusUrl = new URL("/api/power/status", request.nextUrl.origin);
    statusUrl.searchParams.set("_", crypto.randomUUID());
    const res = await fetch(statusUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache"
      },
      next: { revalidate: 0 }
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
  const path = normalizePathname(pathname);

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
    const isPowerControlPage =
      path === "/admin/change/power" || path.startsWith("/admin/change/power/");

    // Private control URL: no admin cookie required (needed when site is OFF and login is blocked).
    if (isPowerControlPage) {
      return NextResponse.next();
    }

    const isLoginPage = path === "/admin" || path === "/admin/login";

    if (isLoginPage) {
      if (cookie === "true" && path === "/admin/login") {
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

