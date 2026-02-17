"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useState } from "react";
import type { VisaApplicantLike } from "./VisaGrantNotice";

function formatDate(value: string | Date) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

const publicNavItems = [
  { label: "Home", href: "https://visa.nadra.gov.pk/" },
  { label: "Guidelines", href: "#" },
  { label: "Downloads", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Contact Us", href: "#" },
];

const COPYRIGHT_TEXT =
  "COPYRIGHT © 2015 - 2026 MINISTRY OF INTERIOR, GOVERNMENT OF PAKISTAN - ALL RIGHTS RESERVED - V: 5.5.9";

/** Logo green – used for logo text fallback and header menu hover */
const LOGO_GREEN = "#164639";

const visaDetailFields = (
  applicant: VisaApplicantLike
): { label: string; value: string }[] => [
  { label: "Passport No", value: applicant.passportNumber },
  {
    label: "Passport Country",
    value: applicant.travelDocumentCountry,
  },
  { label: "Visa Category", value: applicant.visaCategory },
  {
    label: "Visa Sub Category",
    value: applicant.visaSubCategory,
  },
  {
    label: "Application Type",
    value: applicant.applicationType,
  },
  {
    label: "Staying Facility",
    value: applicant.stayFacility,
  },
  {
    label: "Visa Start Date",
    value: formatDate(applicant.visaStartDate),
  },
  {
    label: "Visa End Date",
    value: formatDate(applicant.visaEndDate),
  },
  {
    label: "Visa Duration",
    value: `${applicant.visaDurationDays} day(s)`,
  },
];

/** Desktop: 4 items beside photo (Name + first 3), rest below in two columns */
function getDesktopBesidePhotoFields(
  applicant: VisaApplicantLike
): { label: string; value: string }[] {
  const first = visaDetailFields(applicant).slice(0, 3);
  return [
    { label: "Name", value: `${applicant.firstName} ${applicant.lastName}` },
    ...first,
  ];
}

function getDesktopBelowPhotoFields(
  applicant: VisaApplicantLike
): { label: string; value: string }[] {
  return visaDetailFields(applicant).slice(3);
}

export function PublicVisaView({ applicant }: { applicant: VisaApplicantLike }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - fixed at top, content scrolls underneath */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 md:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            {logoError ? (
              <div className="flex flex-col">
                <span
                  className="text-xl font-bold md:text-2xl"
                  style={{ color: LOGO_GREEN }}
                >
                  Pak Visa
                </span>
                <span
                  className="text-xs font-normal uppercase tracking-widest md:text-sm"
                  style={{ color: `${LOGO_GREEN}cc` }}
                >
                  Islamic Republic of Pakistan
                </span>
              </div>
            ) : (
              <Image
                src="/assets/pak_visa_logo.png"
                alt="Pak Visa - Islamic Republic of Pakistan"
                width={192}
                height={50}
                className="h-12 w-auto object-contain object-left sm:h-14 md:h-[50px] md:w-[192px]"
                unoptimized
                onError={() => setLogoError(true)}
              />
            )}
          </Link>
          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex md:gap-[39px]">
            {publicNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium uppercase tracking-wide text-gray-800 md:text-[14px] md:font-bold hover:text-[#0068ac]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {/* Mobile: hamburger or close X when menu open - color #0068ac */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-12 w-12 items-center justify-center rounded md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Menu"}
          >
            {mobileMenuOpen ? (
              <svg
                className="h-8 w-8 text-[#0068ac]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-7 w-7 text-[#0068ac]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu: fixed overlay on top of visa content (no push down) */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-50 flex flex-col border-b border-gray-100 bg-white shadow-lg md:hidden">
            {/* Nav block - background #1d2738, height only as tall as list items */}
            <nav className="flex flex-col bg-[#1d2738] px-4 py-2">
              {publicNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-[#2a3548] py-4 text-left text-base font-bold text-white last:border-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main content - padding top/bottom so fixed header and footer don't overlap */}
      <main className="mx-auto max-w-2xl px-6 pt-24 pb-28 sm:px-8 sm:pt-28 sm:pb-32 md:max-w-4xl">
        <div className="overflow-hidden bg-[#f5f5f5] shadow-sm md:bg-white md:shadow-md">
          <div className="px-4 pb-8 pt-0 sm:px-6 sm:pb-10 sm:pt-0 md:bg-[#f7f7f7] md:transition-colors md:duration-200 hover:md:bg-white hover:md:shadow-lg">
            {/* Accent line - #0068ac, at very top of main div, 0 space from top; same left edge as visa reference */}
            <div className="mb-4 h-0.5 w-12 bg-[#0068ac] sm:h-1 sm:w-16" />
            {/* Visa Reference Number - 18px both; mobile: two lines; desktop: one line */}
            <div className="pb-5 pt-6 text-center sm:pt-8 md:flex md:items-baseline md:gap-2 md:text-left">
              <p className="text-[18px] font-medium text-[#0068ac] md:mt-0">
                Visa Reference Number –
              </p>
              <p className="mt-1 text-[18px] font-semibold text-[#0068ac] md:mt-0">
                {applicant.visaReferenceNumber}
              </p>
            </div>
            <div className="mt-2 border-b border-gray-300" aria-hidden />

            {/* Photo + details: mobile unchanged; desktop = beside-photo block + below-photo two columns */}
            <div className="mt-6 md:mt-8 md:p-6" role="presentation">
              <div className="flex flex-col items-center md:flex-row md:items-start md:gap-10">
                {/* Applicant photo - on mobile name under photo; on desktop photo only */}
                <div className="flex shrink-0 flex-col items-center md:items-start">
                  <div className="relative h-[170px] w-[140px] overflow-hidden rounded-sm border border-gray-300 bg-gray-200 md:h-[180px] md:w-[140px] md:border-gray-200 md:bg-white">
                    {applicant.photoUrl ? (
                      <img
                        src={applicant.photoUrl}
                        alt={`${applicant.firstName} ${applicant.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                        No Photo
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-center text-base font-normal text-gray-500 md:hidden md:text-left">
                    Name
                  </p>
                  <p className="mt-0.5 text-center text-base font-normal text-gray-800 md:hidden md:text-left">
                    {applicant.firstName} {applicant.lastName}
                  </p>
                </div>

                {/* Mobile: details 15px, centered; only Passport No & Passport Country label bold */}
                <div className="mt-6 w-full md:mt-0 md:flex-1">
                  <div className="flex flex-col gap-7 md:hidden">
                    {visaDetailFields(applicant).map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center text-center"
                      >
                        <span
                          className={`text-[15px] text-gray-500 ${
                            label === "Passport No" ||
                            label === "Passport Country"
                              ? "font-bold"
                              : "font-normal"
                          }`}
                        >
                          {label}
                        </span>
                        <span className="mt-0.5 text-[15px] font-normal text-gray-800">
                          {value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: 4 items beside photo; two columns (labels | values), same y-axis, space between */}
                  <div className="hidden md:block">
                    <div className="grid grid-cols-[auto_1fr] gap-x-12 gap-y-3">
                      {getDesktopBesidePhotoFields(applicant).map(
                        ({ label, value }) => (
                          <Fragment key={label}>
                            <span
                              className={`text-left text-[16px] text-gray-700 ${
                                label === "Passport No" ||
                                label === "Passport Country"
                                  ? "font-bold"
                                  : "font-normal"
                              }`}
                            >
                              {label}
                            </span>
                            <span className="text-left text-[16px] font-normal text-gray-800">
                              {value || "—"}
                            </span>
                          </Fragment>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop only: 6 items below photo in two columns; same rule: labels | values, same y-axis, space between */}
              <div className="mt-0 hidden md:mt-6 md:block">
                <div className="grid grid-cols-2 gap-x-10">
                  {[0, 1].map((col) => (
                    <div
                      key={col}
                      className="grid grid-cols-[auto_1fr] gap-x-12 gap-y-3"
                    >
                      {getDesktopBelowPhotoFields(applicant)
                        .slice(col * 3, col * 3 + 3)
                        .map(({ label, value }) => (
                          <Fragment key={label}>
                            <span className="text-left text-[16px] font-normal text-gray-700">
                              {label}
                            </span>
                            <span className="text-left text-[16px] font-normal text-gray-800">
                              {value || "—"}
                            </span>
                          </Fragment>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="https://visa.nadra.gov.pk/e-visa/authenticate"
                className="inline-block bg-[#0068ac] px-10 py-3 text-center text-sm font-semibold text-white shadow hover:bg-[#005a99]"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - fixed at bottom, content scrolls above it */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-4 py-4 md:px-6">
        <p className="text-center text-xs font-bold leading-relaxed text-black md:text-sm">
          {COPYRIGHT_TEXT}
        </p>
      </footer>
    </div>
  );
}
