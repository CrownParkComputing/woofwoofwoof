"use client";

import { useState } from "react";

export default function GalleryGrid({ items }: { items: { src: string; caption: string }[] }) {
  const [active, setActive] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border-4 border-dashed border-amber-600/30 bg-white/60 p-14 text-center">
        <p className="text-5xl">🐕</p>
        <p className="mt-4 text-xl font-black text-amber-900">Photos coming soon!</p>
        <p className="mt-1 text-amber-800/70">The pack is still posing. Check back shortly.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group relative aspect-square overflow-hidden rounded-2xl border-4 border-amber-900/10 bg-amber-100 shadow-sm transition-transform hover:scale-[1.03] hover:border-amber-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.caption || "A very good dog"}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {item.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-left text-sm font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="lightbox fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActive(null)}
        >
          <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={items[active].src}
              alt={items[active].caption}
              className="max-h-[80vh] w-auto rounded-2xl object-contain"
            />
            {items[active].caption && (
              <figcaption className="mt-3 text-center font-bold text-white">
                {items[active].caption}
              </figcaption>
            )}
            <div className="mt-3 flex justify-center gap-3">
              <button
                onClick={() => setActive((active + items.length - 1) % items.length)}
                className="rounded-full bg-white/15 px-5 py-2 font-bold text-white hover:bg-white/30"
              >
                ← Prev
              </button>
              <button
                onClick={() => setActive(null)}
                className="rounded-full bg-amber-500 px-5 py-2 font-bold text-white hover:bg-amber-600"
              >
                Close
              </button>
              <button
                onClick={() => setActive((active + 1) % items.length)}
                className="rounded-full bg-white/15 px-5 py-2 font-bold text-white hover:bg-white/30"
              >
                Next →
              </button>
            </div>
          </figure>
        </div>
      )}
    </>
  );
}
