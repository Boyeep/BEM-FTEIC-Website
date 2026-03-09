import Link from "next/link";

import { EventSummary } from "@/features/event/types";

interface EventCardGridProps {
  items: EventSummary[];
}

export default function EventCardGrid({ items }: EventCardGridProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/event/read/${item.id}`}
          className="grid grid-cols-[180px_1fr] gap-4"
        >
          <article>
            <div className="relative h-48 w-full overflow-hidden bg-white">
              <img
                src={item.coverImage}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
          </article>
          <article>
            <p className="text-xs font-medium text-[#1D4ED8]">
              {new Date(item.eventDate).toLocaleDateString("en-US")}
            </p>
            <h2 className="mt-2 text-xl font-bold leading-tight text-black md:text-2xl">
              {item.title}
            </h2>
            <p
              className="mt-2 text-lg leading-relaxed text-black/90"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.description}
            </p>
          </article>
        </Link>
      ))}
    </div>
  );
}
