import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import GalleryGrid from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Gallery" };

export default async function Gallery() {
  const { gallery } = await readContent();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-center text-4xl font-black text-amber-950 md:text-5xl">
        The pack 📸
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-lg text-amber-900/70">
        Adventures, sleepovers and very good boys &amp; girls.
      </p>
      <div className="mt-10">
        <GalleryGrid items={gallery} />
      </div>
    </div>
  );
}
