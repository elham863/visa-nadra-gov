import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { setPowerState } from "@/src/lib/power";

function verifyToggleSecret(provided: unknown, expected: string | undefined) {
  if (typeof provided !== "string" || !expected || expected.length === 0) {
    return false;
  }
  if (provided.length !== expected.length) {
    return false;
  }
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const powerOn = body?.powerOn;
    const secretOk = verifyToggleSecret(
      body?.secret,
      process.env.POWER_TOGGLE_SECRET
    );

    if (!secretOk) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
