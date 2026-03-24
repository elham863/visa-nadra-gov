import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/src/lib/prisma";
import { buildMrzCode } from "@/src/lib/codes";
import { getQrBaseUrl } from "@/src/lib/env";

function parseDate(value: unknown): Date {
  if (typeof value !== "string") {
    throw new Error("Invalid date value");
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return d;
}

export async function GET() {
  const applicants = await prisma.applicant.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(applicants);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      photoUrl,
      firstName,
      lastName,
      dateOfVisaApplication,
      visaReferenceNumber,
      dateOfBirth,
      nationality,
      passportNumber,
      visaCategory,
      visaSubCategory,
      applicationType,
      visaGrantDate,
      travelDocumentCountry,
      stayFacility,
      visaStartDate,
      visaEndDate,
      visaDurationDays
    } = body;

    if (!firstName || !lastName || !visaReferenceNumber || !passportNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const mrzCode = buildMrzCode({
      firstName,
      lastName,
      visaReferenceNumber,
      passportNumber
    });

    // Temporary ID to build QR content first
    const created = await prisma.applicant.create({
      data: {
        photoUrl: photoUrl || null,
        firstName,
        lastName,
        dateOfVisaApplication: parseDate(dateOfVisaApplication),
        visaReferenceNumber,
        dateOfBirth: parseDate(dateOfBirth),
        nationality,
        passportNumber,
        visaCategory,
        visaSubCategory,
        applicationType,
        visaGrantDate: parseDate(visaGrantDate),
        travelDocumentCountry,
        stayFacility,
        visaStartDate: parseDate(visaStartDate),
        visaEndDate: parseDate(visaEndDate),
        visaDurationDays: Number(visaDurationDays),
        mrzCode,
        qrCodeDataUrl: "" // placeholder, updated below
      }
    });

    const baseUrl = getQrBaseUrl();
    const qrTargetUrl = `${baseUrl}/e-visa/verify/${created.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrTargetUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 520
    });

    const updated = await prisma.applicant.update({
      where: { id: created.id },
      data: { qrCodeDataUrl }
    });

    return NextResponse.json(updated, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create applicant" },
      { status: 500 }
    );
  }
}

