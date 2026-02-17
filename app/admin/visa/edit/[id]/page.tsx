import { redirect } from "next/navigation";

export default async function AdminVisaEditRedirect({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/edit/${id}`);
}
