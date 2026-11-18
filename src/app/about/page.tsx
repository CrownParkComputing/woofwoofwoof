import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import BarkDog from "@/components/BarkDog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "About us" };

export default async function About() {
  const { about } = await readContent();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="flex-1">
          <h1 className="text-4xl font-black text-amber-950 md:text-5xl">{about.title}</h1>
          {about.body.split("\n").filter(Boolean).map((p, i) => (
            <p key={i} className="mt-4 text-lg leading-relaxed text-amber-900/80">
              {p}
            </p>
          ))}
        </div>
        <div className="floaty shrink-0">
          <BarkDog size={220} />
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {about.badges.map((b, i) => (
          <span
            key={i}
            className="rounded-full border-4 border-amber-600/20 bg-white px-5 py-2.5 font-black text-amber-900 shadow-sm"
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
