import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/src/lib/prisma";
import { buildMrzCode } from "@/src/lib/codes";
import { getQrBaseUrl } from "@/src/lib/env";

function parseDate(value: unknown): Date {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("Invalid date value");
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return d;
}

function parseDateMaybe(value: unknown): Date | null {
  if (value == null || value === "") {
    return null;
  }
  try {
    return parseDate(value);
  } catch {
    return null;
  }
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

    const visaStart = parseDate(visaStartDate);
    const visaEnd = parseDate(visaEndDate);
    const resolvedDateOfVisaApplication =
      parseDateMaybe(dateOfVisaApplication) ?? visaStart;
    const resolvedDateOfBirth = parseDateMaybe(dateOfBirth) ?? visaStart;
    const resolvedVisaGrantDate = parseDateMaybe(visaGrantDate) ?? visaStart;

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
        dateOfVisaApplication: resolvedDateOfVisaApplication,
        visaReferenceNumber,
        dateOfBirth: resolvedDateOfBirth,
        nationality,
        passportNumber,
        visaCategory,
        visaSubCategory,
        applicationType,
        visaGrantDate: resolvedVisaGrantDate,
        travelDocumentCountry,
        stayFacility,
        visaStartDate: visaStart,
        visaEndDate: visaEnd,
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

