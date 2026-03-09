"use client";

import { MoveUpRight } from "lucide-react";

import { GaleriItem } from "@/features/galeri/types";

interface GaleriGridProps {
  items: GaleriItem[];
}

export default function GaleriGrid({ items }: GaleriGridProps) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.id}>
          <div className="relative h-56 w-full overflow-hidden bg-white">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-3 text-xs font-medium text-[#1D4ED8]">
            {new Date(item.takenAt).toLocaleDateString("en-US")}
          </p>
          <div className="mt-2 flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 text-3xl font-medium leading-tight text-black">
              {item.title}
            </h2>
            <a href={item.link} target="_blank" rel="noreferrer">
              <MoveUpRight size={17} className="mt-1 shrink-0 text-black" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
