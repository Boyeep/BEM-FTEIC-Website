"use client";

import { MoveUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const galleryItems = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  date:
    index % 3 === 0 ? "1/2/2026" : index % 3 === 1 ? "27/8/2025" : "15/2/2026",
  title:
    index % 5 === 0
      ? "Lorem Ipsum"
      : index % 5 === 1
        ? "Dolor sit Amet"
        : index % 5 === 2
          ? "Morbi id Ornare Ante"
          : index % 5 === 3
            ? "Suspendisse Dignissim"
            : "Quisque Laoreet Ipsum",
  image:
    index % 2 === 0
      ? "/images/Homepage-About-Image.png"
      : "/images/Homepage-Hero-Image.png",
}));

export default function GaleriGrid() {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  return (
    <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {galleryItems.map((item) => (
        <article key={item.id}>
          <div className="relative h-56 w-full overflow-hidden bg-white">
            {!loadedImages[item.id] ? (
              <div className="absolute inset-0 animate-pulse bg-slate-200" />
            ) : null}
            <Image
              src={item.image}
              alt={`Galeri ${item.id}`}
              fill
              className={`object-cover transition-opacity duration-300 ${
                loadedImages[item.id] ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() =>
                setLoadedImages((prev) =>
                  prev[item.id] ? prev : { ...prev, [item.id]: true },
                )
              }
            />
          </div>
          <p className="mt-3 text-xs font-medium text-[#1D4ED8]">{item.date}</p>
          <div className="mt-2 flex items-start justify-between gap-2">
            <h2 className="text-3xl font-medium leading-tight text-black">
              {item.title}
            </h2>
            <MoveUpRight size={17} className="mt-1 shrink-0 text-black" />
          </div>
        </article>
      ))}
    </div>
  );
}
