import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import BarkDog from "@/components/BarkDog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Contact us" };

export default async function Contact() {
  const { contact } = await readContent();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="flex flex-col items-center gap-10 md:flex-row">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-black text-amber-950 md:text-5xl">Say hello 👋</h1>
          <p className="mt-4 text-lg leading-relaxed text-amber-900/80">{contact.blurb}</p>

          <div className="mt-8 space-y-3 text-lg font-bold text-amber-950">
            <p>
              📞{" "}
              <a className="underline decoration-amber-500 decoration-4 hover:text-amber-700" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                {contact.phone}
              </a>
            </p>
            <p>
              ✉️{" "}
              <a className="underline decoration-amber-500 decoration-4 hover:text-amber-700" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </p>
            <p>📍 {contact.location}</p>
          </div>

          <div className="mt-8 flex justify-center gap-3 md:justify-start">
            <a
              href={contact.facebook}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-amber-600 px-6 py-2.5 font-black text-white transition-transform hover:scale-105"
            >
              Facebook
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border-4 border-amber-600/30 bg-white px-6 py-2.5 font-black text-amber-800 hover:border-amber-600"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="floaty shrink-0">
          <BarkDog size={240} />
        </div>
      </div>
    </div>
  );
}
