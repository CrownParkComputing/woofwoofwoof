import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { isAuthed } from "@/lib/auth";
import { readContent, writeContent, UPLOADS_DIR } from "@/lib/content";

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  const caption = String(form.get("caption") || "");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Only jpg/png/webp/gif/avif images allowed" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Max 10MB" }, { status: 400 });
  }
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));

  const src = `/api/media/${name}`;
  const content = await readContent();
  content.gallery.push({ src, caption });
  await writeContent(content);

  return NextResponse.json({ ok: true, src });
}

export async function DELETE(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { src } = await req.json();
  const name = path.basename(String(src || ""));
  const content = await readContent();
  content.gallery = content.gallery.filter((g) => g.src !== `/api/media/${name}`);
  await writeContent(content);
  await fs.unlink(path.join(UPLOADS_DIR, name)).catch(() => {});
  return NextResponse.json({ ok: true });
}
