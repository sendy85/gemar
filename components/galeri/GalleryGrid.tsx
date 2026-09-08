"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/types/database";
import { formatDate } from "@/lib/utils";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? items[activeIndex] : null;

  function close() {
    setActiveIndex(null);
  }

  function next() {
    setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
  }

  function prev() {
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + items.length) % items.length
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-card bg-brand-green-light shadow-softer"
          >
            <Image
              src={item.photo_url}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="truncate text-xs font-medium text-white">
                {item.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Tutup"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Sebelumnya"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                aria-label="Berikutnya"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-6"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div
            className="max-h-full w-full max-w-2xl overflow-hidden rounded-card bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full bg-brand-green-light">
              <Image
                src={active.photo_url}
                alt={active.title}
                fill
                sizes="(min-width: 640px) 640px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-navy">{active.title}</h3>
              <p className="mt-1 text-xs text-muted">
                {formatDate(active.photo_date)}
              </p>
              {active.description && (
                <p className="mt-2 text-sm text-muted">
                  {active.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

