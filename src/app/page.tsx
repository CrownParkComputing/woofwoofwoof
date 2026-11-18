import Link from "next/link";
import { readContent } from "@/lib/content";
import BarkDog from "@/components/BarkDog";
import Paw from "@/components/Paw";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { home } = await readContent();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-200 to-[#fff8ee]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-14 md:flex-row md:py-20">
          <div className="flex-1 text-center md:text-left">
            <div className="rise-in inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-amber-800 shadow">
              <Paw size={16} className="text-amber-600" /> 5★ DEFRA licensed · Chester
            </div>
            <h1 className="rise-in mt-4 text-5xl font-black leading-tight tracking-tight text-amber-950 md:text-6xl" style={{ animationDelay: "0.1s" }}>
              {home.heroTitle}
            </h1>
            <p className="rise-in mx-auto mt-4 max-w-xl text-lg font-medium text-amber-900/80 md:mx-0" style={{ animationDelay: "0.2s" }}>
              {home.heroSubtitle}
            </p>
            <div className="rise-in mt-8 flex flex-wrap justify-center gap-3 md:justify-start" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/contact"
                className="hover-wiggle rounded-full bg-amber-600 px-7 py-3 text-lg font-black text-white shadow-lg shadow-amber-600/30 transition-colors hover:bg-amber-700"
              >
                {home.ctaText} 🐶
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border-4 border-amber-600/30 bg-white px-7 py-3 text-lg font-black text-amber-800 transition-colors hover:border-amber-600"
              >
                Meet the pack
              </Link>
            </div>
          </div>
          <div className="floaty shrink-0">
            <BarkDog size={260} />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <h2 className="text-3xl font-black text-amber-950 md:text-4xl">{home.introTitle}</h2>
        <p className="mt-4 text-lg leading-relaxed text-amber-900/80">{home.intro}</p>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {home.services.map((s, i) => (
            <div
              key={i}
              className="group rounded-3xl border-4 border-amber-900/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-500 hover:shadow-xl"
            >
              <div className="text-4xl transition-transform group-hover:scale-125">{s.emoji}</div>
              <h3 className="mt-3 text-xl font-black text-amber-950">{s.title}</h3>
              <p className="mt-1.5 font-medium text-amber-900/70">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="mx-4 rounded-3xl bg-amber-900 py-10 text-center text-amber-100 md:mx-auto md:max-w-6xl">
        <p className="text-2xl font-black text-white">Rated ⭐⭐⭐⭐⭐ by DEFRA &amp; by dogs*</p>
        <p className="mt-2 text-sm text-amber-300">*dogs rated us "best humans ever" — source: wagging tails</p>
        <Link
          href="/about"
          className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 font-black text-amber-900 transition-transform hover:scale-105"
        >
          Why trust the pack?
        </Link>
      </section>
    </div>
  );
}
