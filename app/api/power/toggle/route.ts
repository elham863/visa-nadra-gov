import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setPowerState } from "@/src/lib/power";

const ADMIN_COOKIE = "visa_admin_auth";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
    if (adminCookie !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const powerOn = body?.powerOn;
    if (typeof powerOn !== "boolean") {
      return NextResponse.json(
        { error: "Invalid payload. powerOn must be boolean." },
        { status: 400 }
      );
    }

    const nextState = await setPowerState(powerOn);
    return NextResponse.json({ powerOn: nextState });
  } catch (error) {
    console.error("Failed to update power state:", error);
    return NextResponse.json(
      { error: "Failed to update power state" },
      { status: 500 }
    );
  }
}
