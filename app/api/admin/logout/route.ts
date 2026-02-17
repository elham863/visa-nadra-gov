import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "visa_admin_auth";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin";
  url.search = "";
  const response = NextResponse.redirect(url);
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0
  });
  return response;
}
