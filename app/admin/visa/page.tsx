import { redirect } from "next/navigation";

export default async function AdminVisaRedirect({
  searchParams
}: {
  searchParams: Promise<{ tab?: string; preview?: string; created?: string }>;
}) {
  const params = await searchParams;
  const q = new URLSearchParams();
  if (params.tab) q.set("tab", params.tab);
  if (params.preview) q.set("preview", params.preview);
  if (params.created) q.set("created", params.created);
  const query = q.toString();
  redirect(query ? `/admin?${query}` : "/admin");
}
