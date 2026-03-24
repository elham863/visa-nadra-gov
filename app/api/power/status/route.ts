import { NextResponse } from "next/server";
import { getPowerState } from "@/src/lib/power";

export async function GET() {
  try {
    const powerOn = await getPowerState();
    return NextResponse.json({ powerOn });
  } catch (error) {
    console.error("Failed to read power state:", error);
    return NextResponse.json(
      { error: "Failed to read power state" },
      { status: 500 }
    );
  }
}
