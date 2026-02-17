"use client";

import {
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { VisaApplicantLike } from "./VisaGrantNotice";

type Props = {
  applicant: VisaApplicantLike;
};

export type VisaDocumentHandle = {
  downloadPDF: () => Promise<void>;
};

function formatDate(value: string | Date) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

const VisaDocument = forwardRef<VisaDocumentHandle, Props>(
  function VisaDocument({ applicant }, ref) {
    const pdfRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      async downloadPDF() {
        const el = pdfRef.current;
        if (!el) return;

        const canvas = await html2canvas(el, {
          scale: 3,
          backgroundColor: "#ffffff",
          useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        pdf.save(`visa-${applicant.id}.pdf`);
      }
    }));

    const fullName =
      `${applicant.firstName} ${applicant.lastName}`.trim() || "—";

    return (
      <div
        ref={pdfRef}
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "12.5px",
          color: "#000"
        }}
        className="bg-white visa-document-print"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <img
            src="/assets/pak_visa_logo_2.png"
            className="h-14 w-auto max-w-[200px] object-contain object-left"
            alt="Pak Visa"
          />
          <div className="text-sm font-semibold uppercase tracking-[0.15em] mt-2">
            VISA GRANT NOTICE
          </div>
        </div>

        {/* Thick Divider */}
        <div className="mt-4 border-t-[3px] border-[#2f3e46]" />

        {/* PHOTO + QR */}
        <div className="mt-6 flex justify-between">
          <div>
            <div className="flex w-[95px] h-[115px] items-center justify-center overflow-hidden border border-gray-400 bg-gray-100">
              {applicant.photoUrl ? (
                <img
                  src={applicant.photoUrl}
                  className="h-full w-full object-cover object-center"
                  alt=""
                />
              ) : (
                <span className="text-[10px] text-gray-500">No photo</span>
              )}
            </div>
            <div className="mt-2 text-sm font-medium">
              {fullName}
            </div>
          </div>

          <div className="border border-gray-400 p-1">
            <img
              src={applicant.qrCodeDataUrl}
              className="w-[85px] h-[85px]"
              alt="QR"
            />
          </div>
        </div>

        {/* APPLICATION DETAILS */}
        <SectionTitle>Application Details</SectionTitle>
        <SimpleRow
          label="Date of Visa Application"
          value={formatDate(applicant.dateOfVisaApplication)}
        />
        <SimpleRow
          label="Visa Reference Number"
          value={applicant.visaReferenceNumber}
        />

        {/* APPLICANT DETAILS */}
        <SectionTitle>Applicant's Details</SectionTitle>
        <Table
          rows={[
            ["Applicant Name", fullName],
            ["Date of Birth", formatDate(applicant.dateOfBirth)],
            ["Nationality", applicant.nationality],
            ["Passport Number", applicant.passportNumber]
          ]}
        />

        {/* VISA DETAILS */}
        <SectionTitle>Visa Grant Details</SectionTitle>
        <Table
          rows={[
            ["Visa Category", applicant.visaCategory],
            ["Visa Sub Category", applicant.visaSubCategory],
            ["Application Type", applicant.applicationType],
            ["Visa Grant Date", formatDate(applicant.visaGrantDate)],
            ["Travel Document Country", applicant.travelDocumentCountry],
            ["Stay Facility", applicant.stayFacility],
            ["Visa Start Date", formatDate(applicant.visaStartDate)],
            ["Visa End Date", formatDate(applicant.visaEndDate)],
            ["Visa Duration", `${applicant.visaDurationDays} Day(s)`]
          ]}
        />

        {/* CONDITIONS */}
        <div className="mt-6 bg-[#f1f1f1] p-3 text-[11px] leading-snug">
          <div className="font-bold uppercase mb-1">
            VISA CONDITIONS AND ENTITLEMENTS
          </div>
          <p>
            Entry may be made on any date between visa start date & visa end date.
          </p>
          <p className="mt-1">
            This visa is granted based upon information and documents provided by the applicant, hence, any incorrect or misleading information/documents provided may lead to legal consequences including (but not limited to):
          </p>
          <ul className="list-disc ml-4 mt-1">
            <li>Visa Cancellation</li>
            <li>Detention</li>
            <li>Removal from Pakistan</li>
          </ul>
        </div>

        {/* MRZ */}
        <div className="mt-6 font-mono text-[11px] tracking-[0.25em] leading-tight break-all">
          {applicant.mrzCode}
        </div>

        {/* FOOTER */}
        <div className="mt-10 flex items-center gap-3">
          <img
            src="/assets/pak_visa_logo_2.png"
            className="h-8 w-auto max-w-[115px] object-contain object-left"
            alt="Pak Visa"
          />
          <div className="text-sm">
            {formatDate(applicant.visaGrantDate)}
          </div>
        </div>
      </div>
    );
  }
);

VisaDocument.displayName = "VisaDocument";
export default VisaDocument;

/* ---------- COMPONENTS ---------- */

function SectionTitle({ children }: any) {
  return (
    <div className="mt-5 mb-1 text-sm font-bold">
      {children}
    </div>
  );
}

function SimpleRow({ label, value }: any) {
  return (
    <div className="flex text-sm mb-0.5">
      <div className="w-[230px]">{label}</div>
      <div>{value || "—"}</div>
    </div>
  );
}

function Table({ rows }: any) {
  return (
    <div className="border border-gray-400 text-sm">
      {rows.map(([l, v]: any, i: number) => (
        <div
          key={i}
          className="flex border-t border-gray-400 first:border-t-0"
        >
          <div className="w-[250px] bg-[#eeeeee] border-r border-gray-400 py-1.5 px-2">
            {l}
          </div>
          <div className="flex-1 py-1.5 px-2">
            {v || "—"}
          </div>
        </div>
      ))}
    </div>
  );
}
