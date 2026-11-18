import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Paw from "@/components/Paw";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Testimonials" };

export default async function Testimonials() {
  const { testimonials } = await readContent();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-center text-4xl font-black text-amber-950 md:text-5xl">
        Tail-wagging reviews 🐾
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-lg text-amber-900/70">
        Straight from the humans (and translated from the dogs).
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {testimonials.map((t, i) => (
          <blockquote
            key={i}
            className="relative rounded-3xl border-4 border-amber-900/10 bg-white p-6 pt-8 shadow-sm"
          >
            <Paw className="absolute -top-4 left-6 rotate-[-12deg] text-amber-500" size={34} />
            <p className="text-lg font-medium leading-relaxed text-amber-950">“{t.text}”</p>
            <footer className="mt-4">
              <p className="font-black text-amber-800">— {t.name}</p>
              {t.dog && <p className="text-sm font-bold text-amber-700/60">{t.dog}</p>}
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
