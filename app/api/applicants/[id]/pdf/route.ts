import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait in points
  const { width, height } = page.getSize();
  const margin = 40;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - margin;

  const drawText = (
    text: string,
    options: { size?: number; x?: number; y?: number; bold?: boolean } = {}
  ) => {
    const { size = 11, x = margin, y: yPos, bold = false } = options;
    page.drawText(text, {
      x,
      y: yPos ?? y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0, 0, 0)
    });
  };

  const formatDate = (value: Date) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",   // was "MMM"
      year: "numeric"
    });

  // Header
  drawText("Pak eVisa", { size: 18, bold: true });
  drawText("Islamic Republic of Pakistan", {
    size: 10,
    y: y - 16
  });
  drawText("Ministry of Interior", {
    size: 10,
    y: y - 28
  });

  drawText("VISA GRANT NOTICE", {
    size: 12,
    bold: true,
    x: width - margin - 160,
    y
  });

  y -= 60;

  // Application details
  drawText("Application Details", { bold: true, size: 12, y });
  y -= 16;
  drawText(
    `Date of Visa Application: ${formatDate(applicant.dateOfVisaApplication)}`,
    { size: 10, y }
  );
  y -= 14;
  drawText(`Visa Reference Number: ${applicant.visaReferenceNumber}`, {
    size: 10,
    y
  });

  y -= 26;

  // Applicant details
  drawText("Applicant's Details", { bold: true, size: 12, y });
  y -= 16;
  drawText(
    `Applicant Name: ${applicant.firstName} ${applicant.lastName}`,
    { size: 10, y }
  );
  y -= 14;
  drawText(`Date of Birth: ${formatDate(applicant.dateOfBirth)}`, {
    size: 10,
    y
  });
  y -= 14;
  drawText(`Nationality: ${applicant.nationality}`, { size: 10, y });
  y -= 14;
  drawText(`Passport Number: ${applicant.passportNumber}`, {
    size: 10,
    y
  });

  y -= 26;

  // Visa grant details
  drawText("Visa Grant Details", { bold: true, size: 12, y });
  y -= 16;
  const visaLines = [
    `Visa Category: ${applicant.visaCategory}`,
    `Visa Sub Category: ${applicant.visaSubCategory}`,
    `Application Type: ${applicant.applicationType}`,
    `Visa Grant Date: ${formatDate(applicant.visaGrantDate)}`,
    `Travel Document Country: ${applicant.travelDocumentCountry}`,
    `Stay Facility: ${applicant.stayFacility}`,
    `Visa Start Date: ${formatDate(applicant.visaStartDate)}`,
    `Visa End Date: ${formatDate(applicant.visaEndDate)}`,
    `Visa Duration: ${applicant.visaDurationDays} Day(s)`
  ];

  for (const line of visaLines) {
    drawText(line, { size: 10, y });
    y -= 14;
  }

  y -= 20;

  // MRZ code
  drawText("Machine-readable code", { bold: true, size: 12, y });
  y -= 18;
  const mrzLines = applicant.mrzCode.split("\n");
  mrzLines.forEach((line) => {
    drawText(line, {
      size: 10,
      y,
      x: margin,
      bold: true
    });
    y -= 14;
  });

  y -= 20;

  // QR code if available
  if (applicant.qrCodeDataUrl && applicant.qrCodeDataUrl.startsWith("data:")) {
    try {
      const base64 = applicant.qrCodeDataUrl.split(",")[1] ?? "";
      const pngBytes = Buffer.from(base64, "base64");
      const image = await pdfDoc.embedPng(pngBytes);
      const size = 100;
      page.drawImage(image, {
        x: width - margin - size,
        y: y - size + 20,
        width: size,
        height: size
      });
    } catch (e) {
      console.error("Failed to embed QR in PDF", e);
    }
  }

  // Footer date
  drawText(`Generated on: ${formatDate(new Date())}`, {
    size: 9,
    y: margin / 2
  });

  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([pdfBytes as unknown as BlobPart], {
    type: "application/pdf"
  });

  return new NextResponse(pdfBlob, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="visa-${applicant.id}.pdf"`
    }
  });
}

