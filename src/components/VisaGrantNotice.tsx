export type VisaApplicantLike = {
  id: string;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
  dateOfVisaApplication: string | Date;
  visaReferenceNumber: string;
  dateOfBirth: string | Date;
  nationality: string;
  passportNumber: string;
  visaCategory: string;
  visaSubCategory: string;
  applicationType: string;
  visaGrantDate: string | Date;
  travelDocumentCountry: string;
  stayFacility: string;
  visaStartDate: string | Date;
  visaEndDate: string | Date;
  visaDurationDays: number;
  mrzCode: string;
  qrCodeDataUrl: string;
  createdAt?: string | Date;
};

function formatDate(value: string | Date) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function VisaGrantNotice({ applicant }: { applicant: VisaApplicantLike }) {
  return (
    <div className="min-h-screen bg-white p-10 print:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <header className="mb-6 flex items-start justify-between border-b border-gray-300 pb-3">
          {/* Left: Logo (horizontal emblem + Pak Visa text) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/pak_visa_logo_2.png"
            alt="Pak Visa"
            className="h-12 w-auto max-w-[170px] shrink-0 object-contain object-left"
          />

          {/* Right: Title and QR Code */}
          <div className="flex flex-col items-end gap-2.5">
            <h1 className="text-base font-bold uppercase tracking-[0.1em] text-black">
              VISA GRANT NOTICE
            </h1>
            <div className="border border-gray-300 bg-white p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={applicant.qrCodeDataUrl}
                alt="QR Code"
                className="h-20 w-20"
              />
            </div>
          </div>
        </header>

        {/* Photo and Name Section */}
        <div className="mb-5 flex items-start">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-[4.5rem] w-20 items-center justify-center overflow-hidden border border-gray-300 bg-gray-100">
              {applicant.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={applicant.photoUrl}
                  alt={`${applicant.firstName} ${applicant.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[9px] text-gray-500">No Photo</span>
              )}
            </div>
            <p className="max-w-[6rem] text-center text-xs font-normal text-black leading-tight">
              {applicant.firstName} {applicant.lastName}
            </p>
          </div>
        </div>

        {/* Application Details */}
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-bold text-black">
            Application Details
          </h2>
          <div className="space-y-0.5">
            <div className="flex max-w-md justify-between">
              <span className="text-[10px] font-normal text-black">
                Date of Visa Application
              </span>
              <span className="text-[10px] font-normal text-black">
                {formatDate(applicant.dateOfVisaApplication)}
              </span>
            </div>
            <div className="flex max-w-md justify-between">
              <span className="text-[10px] font-normal text-black">
                Visa Reference Number
              </span>
              <span className="text-[10px] font-normal text-black">
                {applicant.visaReferenceNumber}
              </span>
            </div>
          </div>
        </section>

        {/* Applicant's Details */}
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-bold text-black">
            Applicant&apos;s Details
          </h2>
          <div className="border border-gray-300">
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 bg-gray-50 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">Applicant Name</div>
              <div className="text-[10px] font-normal text-black">
                {applicant.firstName} {applicant.lastName}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">Date of Birth</div>
              <div className="text-[10px] font-normal text-black">
                {formatDate(applicant.dateOfBirth)}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">Nationality</div>
              <div className="text-[10px] font-normal text-black">
                {applicant.nationality}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">
                Passport Number
              </div>
              <div className="text-[10px] font-normal text-black">
                {applicant.passportNumber}
              </div>
            </div>
          </div>
        </section>

        {/* Visa Grant Details */}
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-bold text-black">
            Visa Grant Details
          </h2>
          <div className="border border-gray-300">
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 bg-gray-50 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">Visa Category</div>
              <div className="text-[10px] font-normal text-black">
                {applicant.visaCategory}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">
                Visa Sub Category
              </div>
              <div className="text-[10px] font-normal text-black">
                {applicant.visaSubCategory}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">Application Type</div>
              <div className="text-[10px] font-normal text-black">
                {applicant.applicationType}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">Visa Grant Date</div>
              <div className="text-[10px] font-normal text-black">
                {formatDate(applicant.visaGrantDate)}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">
                Travel Document Country
              </div>
              <div className="text-[10px] font-normal text-black">
                {applicant.travelDocumentCountry}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">Stay Facility</div>
              <div className="text-[10px] font-normal text-black">
                {applicant.stayFacility}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">Visa Start Date</div>
              <div className="text-[10px] font-normal text-black">
                {formatDate(applicant.visaStartDate)}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] border-b border-gray-300 px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">Visa End Date</div>
              <div className="text-[10px] font-normal text-black">
                {formatDate(applicant.visaEndDate)}
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr,1.6fr] px-2.5 py-1.5">
              <div className="text-[10px] font-normal text-black">Visa Duration</div>
              <div className="text-[10px] font-normal text-black">
                {applicant.visaDurationDays} Day(s)
              </div>
            </div>
          </div>
        </section>

        {/* Visa Conditions and Entitlements */}
        <section className="mb-5 bg-gray-100 p-3">
          <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.05em] text-black">
            VISA CONDITIONS AND ENTITLEMENTS
          </h3>
          <p className="mb-1 text-[9px] leading-relaxed text-black">
            Entry may be made on any date between visa start date & visa end date.
          </p>
          <p className="mb-1.5 text-[9px] leading-relaxed text-black">
            This visa is granted based upon information and documents provided by
            the applicant, hence, any incorrect or misleading information/documents
            provided may lead to legal consequences including (but not limit to):
          </p>
          <ul className="ml-4 list-none space-y-0.5">
            <li className="text-[9px] text-black before:mr-1.5 before:content-['■']">
              Visa Cancellation
            </li>
            <li className="text-[9px] text-black before:mr-1.5 before:content-['■']">
              Detention
            </li>
            <li className="text-[9px] text-black before:mr-1.5 before:content-['■']">
              Removal from Pakistan
            </li>
          </ul>
        </section>

        {/* MRZ Code */}
        <section className="mb-5 text-center">
          <pre className="inline-block bg-gray-50 px-3 py-1.5 font-mono text-[10px] leading-tight tracking-[0.15em] text-black">
            {applicant.mrzCode}
          </pre>
        </section>

        {/* Footer */}
        <footer className="mt-6 flex items-center gap-3 border-t border-gray-300 pt-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/pak_visa_logo_2.png"
            alt="Pak Visa"
            className="h-8 w-auto max-w-[115px] shrink-0 object-contain object-left"
          />
          <p className="text-[9px] font-normal text-black">
            {formatDate(applicant.visaGrantDate)}
          </p>
        </footer>
      </div>
    </div>
  );
}
