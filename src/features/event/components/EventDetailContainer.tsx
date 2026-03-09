"use client";

import EventDetail from "@/features/event/components/EventDetail";
import EventDetailSkeleton from "@/features/event/components/EventDetailSkeleton";
import { useEventById } from "@/features/event/hooks/useEventById";

interface EventDetailContainerProps {
  id: string;
}

export default function EventDetailContainer({
  id,
}: EventDetailContainerProps) {
  const { data, isPending, isError, error, refetch } = useEventById(id);

  if (isPending) {
    return <EventDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <p className="text-sm text-red-600">{error.message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return <EventDetail event={data.item} />;
}
