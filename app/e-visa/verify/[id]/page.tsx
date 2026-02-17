import { prisma } from "@/src/lib/prisma";
import { PublicVisaView } from "@/src/components/PublicVisaView";

export default async function PublicApplicantPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    
    if (!id || typeof id !== "string") {
      return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-700">
            Invalid verification ID.
          </div>
        </div>
      );
    }

    const applicant = await prisma.applicant.findUnique({
      where: { id }
    });

    if (!applicant) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-700">
            Record not found.
          </div>
        </div>
      );
    }

    return <PublicVisaView applicant={applicant} />;
  } catch (error) {
    console.error("Error loading applicant:", error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-700">
          Error loading record. Please try again.
        </div>
      </div>
    );
  }
}
