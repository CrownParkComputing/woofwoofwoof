import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { readContent } from "@/lib/content";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/admin/login");
  const content = await readContent();
  return <AdminClient initial={content} />;
}
