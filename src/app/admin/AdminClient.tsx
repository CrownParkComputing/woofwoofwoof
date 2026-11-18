"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/content";

type Tab = "home" | "about" | "testimonials" | "gallery" | "contact";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "home", label: "Home page", emoji: "🏠" },
  { id: "about", label: "About us", emoji: "🐶" },
  { id: "testimonials", label: "Testimonials", emoji: "💬" },
  { id: "gallery", label: "Gallery", emoji: "📸" },
  { id: "contact", label: "Contact", emoji: "📞" },
];

const input =
  "w-full rounded-xl border-2 border-amber-900/20 bg-white px-4 py-2.5 font-medium outline-none focus:border-amber-500";
const label = "mb-1 block text-sm font-black text-amber-900";

export default function AdminClient({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<Tab>("home");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  function patch(fn: (c: SiteContent) => void) {
    setContent((c) => {
      const next = structuredClone(c);
      fn(next);
      return next;
    });
  }

  async function save() {
    setStatus("Saving…");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setStatus(res.ok ? "Saved! ✅" : "Save failed 😢");
    router.refresh();
    setTimeout(() => setStatus(""), 2500);
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const caption = (document.getElementById("cap") as HTMLInputElement)?.value || "";
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("caption", caption);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    e.target.value = "";
    if (res.ok) {
      const { src } = await res.json();
      patch((c) => c.gallery.push({ src, caption }));
      setStatus("Photo added! 📸");
      setTimeout(() => setStatus(""), 2500);
    } else {
      const { error } = await res.json().catch(() => ({ error: "Upload failed" }));
      setStatus(error);
    }
  }

  async function removePhoto(src: string) {
    if (!confirm("Delete this photo?")) return;
    await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src }),
    });
    patch((c) => (c.gallery = c.gallery.filter((g) => g.src !== src)));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-amber-950">Admin 🦴</h1>
        <div className="flex items-center gap-3">
          {status && <span className="font-bold text-amber-800">{status}</span>}
          <button
            onClick={save}
            className="rounded-full bg-amber-600 px-6 py-2.5 font-black text-white hover:bg-amber-700"
          >
            Save all
          </button>
          <button
            onClick={logout}
            className="rounded-full border-2 border-amber-900/20 px-5 py-2 font-bold text-amber-900 hover:bg-amber-100"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 font-bold transition-colors ${
              tab === t.id ? "bg-amber-600 text-white" : "bg-white text-amber-900 hover:bg-amber-200"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border-4 border-amber-900/10 bg-white/70 p-6">
        {tab === "home" && (
          <div className="space-y-4">
            <div>
              <label className={label}>Hero title</label>
              <input className={input} value={content.home.heroTitle}
                onChange={(e) => patch((c) => (c.home.heroTitle = e.target.value))} />
            </div>
            <div>
              <label className={label}>Hero subtitle</label>
              <textarea className={input} rows={2} value={content.home.heroSubtitle}
                onChange={(e) => patch((c) => (c.home.heroSubtitle = e.target.value))} />
            </div>
            <div>
              <label className={label}>Intro title</label>
              <input className={input} value={content.home.introTitle}
                onChange={(e) => patch((c) => (c.home.introTitle = e.target.value))} />
            </div>
            <div>
              <label className={label}>Intro text</label>
              <textarea className={input} rows={3} value={content.home.intro}
                onChange={(e) => patch((c) => (c.home.intro = e.target.value))} />
            </div>
            <div>
              <label className={label}>Button text</label>
              <input className={input} value={content.home.ctaText}
                onChange={(e) => patch((c) => (c.home.ctaText = e.target.value))} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className={label + " mb-0"}>Service cards</label>
                <button
                  onClick={() => patch((c) => c.home.services.push({ emoji: "🐾", title: "New service", text: "" }))}
                  className="rounded-full bg-amber-200 px-4 py-1.5 text-sm font-black text-amber-900 hover:bg-amber-300"
                >
                  + Add card
                </button>
              </div>
              <div className="space-y-3">
                {content.home.services.map((s, i) => (
                  <div key={i} className="flex gap-2 rounded-2xl border-2 border-amber-900/10 bg-white p-3">
                    <input className="w-16 rounded-xl border-2 border-amber-900/20 px-2 py-2 text-center text-xl" value={s.emoji}
                      onChange={(e) => patch((c) => (c.home.services[i].emoji = e.target.value))} />
                    <div className="flex-1 space-y-2">
                      <input className={input} placeholder="Title" value={s.title}
                        onChange={(e) => patch((c) => (c.home.services[i].title = e.target.value))} />
                      <input className={input} placeholder="Description" value={s.text}
                        onChange={(e) => patch((c) => (c.home.services[i].text = e.target.value))} />
                    </div>
                    <button
                      onClick={() => patch((c) => c.home.services.splice(i, 1))}
                      className="self-start rounded-lg px-2 py-1 text-red-500 hover:bg-red-50"
                      aria-label="Remove"
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "about" && (
          <div className="space-y-4">
            <div>
              <label className={label}>Title</label>
              <input className={input} value={content.about.title}
                onChange={(e) => patch((c) => (c.about.title = e.target.value))} />
            </div>
            <div>
              <label className={label}>Body (blank line = new paragraph)</label>
              <textarea className={input} rows={8} value={content.about.body}
                onChange={(e) => patch((c) => (c.about.body = e.target.value))} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className={label + " mb-0"}>Trust badges</label>
                <button
                  onClick={() => patch((c) => c.about.badges.push("⭐ New badge"))}
                  className="rounded-full bg-amber-200 px-4 py-1.5 text-sm font-black text-amber-900 hover:bg-amber-300"
                >
                  + Add badge
                </button>
              </div>
              {content.about.badges.map((b, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <input className={input} value={b}
                    onChange={(e) => patch((c) => (c.about.badges[i] = e.target.value))} />
                  <button
                    onClick={() => patch((c) => c.about.badges.splice(i, 1))}
                    className="rounded-lg px-3 text-red-500 hover:bg-red-50"
                  >✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "testimonials" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => patch((c) => c.testimonials.push({ name: "", text: "", dog: "" }))}
                className="rounded-full bg-amber-200 px-4 py-1.5 text-sm font-black text-amber-900 hover:bg-amber-300"
              >
                + Add testimonial
              </button>
            </div>
            {content.testimonials.map((t, i) => (
              <div key={i} className="space-y-2 rounded-2xl border-2 border-amber-900/10 bg-white p-4">
                <div className="flex gap-2">
                  <input className={input} placeholder="Name, e.g. Sarah & Biscuit" value={t.name}
                    onChange={(e) => patch((c) => (c.testimonials[i].name = e.target.value))} />
                  <input className={input} placeholder="Dog, e.g. Golden Retriever" value={t.dog}
                    onChange={(e) => patch((c) => (c.testimonials[i].dog = e.target.value))} />
                </div>
                <textarea className={input} rows={3} placeholder="What they said…" value={t.text}
                  onChange={(e) => patch((c) => (c.testimonials[i].text = e.target.value))} />
                <button
                  onClick={() => patch((c) => c.testimonials.splice(i, 1))}
                  className="text-sm font-bold text-red-500 hover:underline"
                >
                  Remove testimonial
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "gallery" && (
          <div>
            <div className="rounded-2xl border-4 border-dashed border-amber-600/30 bg-white p-5">
              <label className={label}>Add a photo</label>
              <input id="cap" className={input} placeholder="Caption (optional), e.g. Biscuit's first swim" />
              <input
                type="file"
                accept="image/*"
                onChange={upload}
                disabled={uploading}
                className="mt-3 block w-full text-sm font-bold text-amber-900 file:mr-4 file:rounded-full file:border-0 file:bg-amber-600 file:px-5 file:py-2.5 file:font-black file:text-white hover:file:bg-amber-700"
              />
              {uploading && <p className="mt-2 text-sm font-bold text-amber-700">Uploading…</p>}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {content.gallery.map((g, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border-4 border-amber-900/10 bg-amber-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={g.caption} className="aspect-square w-full object-cover" />
                  <button
                    onClick={() => removePhoto(g.src)}
                    className="absolute right-2 top-2 rounded-full bg-red-600/90 px-3 py-1 text-sm font-black text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Delete
                  </button>
                  {g.caption && (
                    <p className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-xs font-bold text-white">
                      {g.caption}
                    </p>
                  )}
                </div>
              ))}
              {content.gallery.length === 0 && (
                <p className="col-span-full py-8 text-center font-bold text-amber-800/60">
                  No photos yet — upload your first good boy or girl above!
                </p>
              )}
            </div>
          </div>
        )}

        {tab === "contact" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Phone</label>
              <input className={input} value={content.contact.phone}
                onChange={(e) => patch((c) => (c.contact.phone = e.target.value))} />
            </div>
            <div>
              <label className={label}>Email</label>
              <input className={input} value={content.contact.email}
                onChange={(e) => patch((c) => (c.contact.email = e.target.value))} />
            </div>
            <div>
              <label className={label}>Location</label>
              <input className={input} value={content.contact.location}
                onChange={(e) => patch((c) => (c.contact.location = e.target.value))} />
            </div>
            <div>
              <label className={label}>Facebook URL</label>
              <input className={input} value={content.contact.facebook}
                onChange={(e) => patch((c) => (c.contact.facebook = e.target.value))} />
            </div>
            <div>
              <label className={label}>LinkedIn URL</label>
              <input className={input} value={content.contact.linkedin}
                onChange={(e) => patch((c) => (c.contact.linkedin = e.target.value))} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Intro blurb</label>
              <textarea className={input} rows={3} value={content.contact.blurb}
                onChange={(e) => patch((c) => (c.contact.blurb = e.target.value))} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
