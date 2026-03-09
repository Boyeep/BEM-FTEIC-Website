import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { EventSummary } from "@/features/event/types";

interface EventDetailProps {
  event: EventSummary;
}

export default function EventDetail({ event }: EventDetailProps) {
  const eventDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const paragraphs = event.description.split("\n\n");

  return (
    <article className="mx-auto w-full max-w-6xl bg-white px-6 py-6 md:py-10">
      <div className="relative mb-6 h-56 w-full overflow-hidden border border-brand-blue/30 md:h-[360px]">
        <img
          src={event.coverImage}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <p className="absolute bottom-3 left-3 inline-flex bg-brand-gold px-3 py-1 text-xs font-medium uppercase text-black">
          {event.category}
        </p>
      </div>

      <Link
        href="/event"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase text-brand-blue hover:text-brand-gold md:text-base"
      >
        <ArrowLeft size={18} />
        Kembali
      </Link>

      <h1 className="mt-3 max-w-5xl text-4xl font-bold leading-tight text-black md:text-6xl">
        {event.title}
      </h1>
      <p className="mt-5 text-xl text-black/60 md:text-2xl">
        ditulis oleh: {event.author}
      </p>
      <div className="mt-5 space-y-5 text-lg leading-relaxed text-black md:text-2xl">
        {paragraphs.map((paragraph, index) => (
          <p key={`${event.id}-paragraph-${index}`}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-7 text-2xl text-brand-blue md:text-3xl">{eventDate}</p>
    </article>
  );
}
