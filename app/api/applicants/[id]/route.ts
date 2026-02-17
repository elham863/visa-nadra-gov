import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { buildMrzCode } from "@/src/lib/codes";

function parseDateMaybe(value: unknown): Date | undefined {
  if (value == null || value === "") return undefined;
  if (typeof value !== "string") return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const applicant = await prisma.applicant.findUnique({
    where: { id: params.id }
  });
  if (!applicant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(applicant);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const existing = await prisma.applicant.findUnique({
      where: { id: params.id }
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

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

    const mrzCode = buildMrzCode({
      firstName: firstName ?? existing.firstName,
      lastName: lastName ?? existing.lastName,
      visaReferenceNumber: visaReferenceNumber ?? existing.visaReferenceNumber,
      passportNumber: passportNumber ?? existing.passportNumber
    });

    const updated = await prisma.applicant.update({
      where: { id: params.id },
      data: {
        photoUrl: photoUrl ?? existing.photoUrl,
        firstName: firstName ?? existing.firstName,
        lastName: lastName ?? existing.lastName,
        dateOfVisaApplication:
          parseDateMaybe(dateOfVisaApplication) ??
          existing.dateOfVisaApplication,
        visaReferenceNumber:
          visaReferenceNumber ?? existing.visaReferenceNumber,
        dateOfBirth: parseDateMaybe(dateOfBirth) ?? existing.dateOfBirth,
        nationality: nationality ?? existing.nationality,
        passportNumber: passportNumber ?? existing.passportNumber,
        visaCategory: visaCategory ?? existing.visaCategory,
        visaSubCategory: visaSubCategory ?? existing.visaSubCategory,
        applicationType: applicationType ?? existing.applicationType,
        visaGrantDate:
          parseDateMaybe(visaGrantDate) ?? existing.visaGrantDate,
        travelDocumentCountry:
          travelDocumentCountry ?? existing.travelDocumentCountry,
        stayFacility: stayFacility ?? existing.stayFacility,
        visaStartDate: parseDateMaybe(visaStartDate) ?? existing.visaStartDate,
        visaEndDate: parseDateMaybe(visaEndDate) ?? existing.visaEndDate,
        visaDurationDays:
          typeof visaDurationDays === "number"
            ? visaDurationDays
            : existing.visaDurationDays,
        mrzCode
        // qrCodeDataUrl stays the same as ID doesn't change
      }
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update applicant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    await prisma.applicant.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete applicant" },
      { status: 500 }
    );
  }
}

