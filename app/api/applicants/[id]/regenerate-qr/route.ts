import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/src/lib/prisma";

const QR_OPTIONS = {
  errorCorrectionLevel: "H" as const,
  margin: 1,
  width: 520
};

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id: params.id }
    });
    if (!applicant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      "https://visa-nadra-gov.vercel.app";
    const qrTargetUrl = `${baseUrl}/e-visa/verify/${applicant.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrTargetUrl, QR_OPTIONS);

    const updated = await prisma.applicant.update({
      where: { id: params.id },
      data: { qrCodeDataUrl }
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to regenerate QR code" },
      { status: 500 }
    );
  }
}
