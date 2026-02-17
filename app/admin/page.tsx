import { cookies } from "next/headers";
import { AdminLoginForm } from "@/src/components/AdminLoginForm";
import { AdminVisaDashboard } from "@/src/components/AdminVisaDashboard";
import { prisma } from "@/src/lib/prisma";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("visa_admin_auth");

  if (!auth?.value) {
    return <AdminLoginForm />;
  }

  const applicants = await prisma.applicant.findMany({
    orderBy: { createdAt: "desc" }
  });

  const serialized = applicants.map((a) => ({
    ...a,
    dateOfVisaApplication: a.dateOfVisaApplication.toISOString(),
    dateOfBirth: a.dateOfBirth.toISOString(),
    visaGrantDate: a.visaGrantDate.toISOString(),
    visaStartDate: a.visaStartDate.toISOString(),
    visaEndDate: a.visaEndDate.toISOString(),
    createdAt: a.createdAt?.toISOString()
  }));

  return <AdminVisaDashboard applicants={serialized} />;
}
