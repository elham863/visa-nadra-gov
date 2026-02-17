import { redirect } from "next/navigation";

export default async function LegacyPublicPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/e-visa/verify/${id}`);
}
