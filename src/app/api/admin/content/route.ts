import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { readContent, writeContent, SiteContent } from "@/lib/content";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await readContent());
}

export async function PUT(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as SiteContent;
  if (!body.home || !body.about || !Array.isArray(body.testimonials) || !Array.isArray(body.gallery) || !body.contact) {
    return NextResponse.json({ error: "Invalid content shape" }, { status: 400 });
  }
  await writeContent(body);
  return NextResponse.json({ ok: true });
}
