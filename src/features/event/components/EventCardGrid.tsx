import { EventSummary } from "@/features/event/types";

interface EventCardGridProps {
  items: EventSummary[];
}

export default function EventCardGrid({ items }: EventCardGridProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="grid grid-cols-[180px_1fr] gap-4">
          <div className="relative h-48 w-full overflow-hidden bg-white">
            <img
              src={item.coverImage}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-[#1D4ED8]">
              {new Date(item.eventDate).toLocaleDateString("en-US")}
            </p>
            <h2 className="mt-2 text-4xl font-bold leading-tight text-black">
              {item.title}
            </h2>
            <p className="mt-2 text-lg leading-relaxed text-black/90">
              {item.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
