export function buildMrzCode(params: {
  firstName: string;
  lastName: string;
  visaReferenceNumber: string;
  passportNumber: string;
}) {
  const first = params.firstName.trim().toUpperCase().replace(/\s+/g, "<");
  const last = params.lastName.trim().toUpperCase().replace(/\s+/g, "<");
  const passport = params.passportNumber.trim().toUpperCase().replace(/\s+/g, "");
  const visaRef = params.visaReferenceNumber.trim().toUpperCase();

  const line1 = `V<PAK${first}<<${last}<<<<<<<<<<<<<<<<`;
  const line2 = `${visaRef}|<1AFG2008298M2702109${passport}<<<<`;

  return `${line1}\n${line2}`;
}

