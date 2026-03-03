"use client";

import Link from "next/link";

import { useEvents } from "@/features/event/hooks/useEvents";

export default function EventSection() {
  const { data } = useEvents({ page: 1, limit: 6 });
  const items = data?.items ?? [];

  return (
    <section className="bg-[#F3F3F3] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="text-4xl font-extrabold uppercase text-[#1D4ED8] md:text-5xl">
          Event
        </h3>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {items.map((event) => (
            <article key={event.id}>
              <div className="relative h-56 w-full overflow-hidden bg-white">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="px-5 pb-1 pt-6">
                <p className="text-3xl font-bold text-[#1D4ED8] md:text-[34px]">
                  {event.title}
                </p>
                <p className="mt-3 text-xl leading-relaxed text-black/90 md:text-2xl">
                  {event.description}
                </p>
                <Link
                  href="/event"
                  className="mt-4 inline-block text-sm font-medium uppercase text-black"
                >
                  Selengkapnya ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
