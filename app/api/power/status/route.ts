import { NextResponse } from "next/server";
import { getPowerState } from "@/src/lib/power";

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control":
    "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store"
};

export async function GET() {
  try {
    const powerOn = await getPowerState();
    return NextResponse.json(
      { powerOn },
      { headers: noStoreHeaders }
    );
  } catch (error) {
    console.error("Failed to read power state:", error);
    return NextResponse.json(
      { error: "Failed to read power state" },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
