import { redirect } from "next/navigation";

export default function AdminListRedirect() {
  redirect("/admin?tab=list");
}
