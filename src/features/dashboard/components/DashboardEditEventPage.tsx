"use client";

import DashboardEventForm from "@/features/dashboard/components/DashboardEventForm";
import { useDashboardEventById } from "@/features/event/hooks/useDashboardEventById";

interface DashboardEditEventPageProps {
  id: string;
}

export default function DashboardEditEventPage({
  id,
}: DashboardEditEventPageProps) {
  const { data, isPending, isError, error } = useDashboardEventById(id);

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
        <p className="mx-auto max-w-[1280px] text-sm text-black/70">
          Loading...
        </p>
      </main>
    );
  }

  if (isError || !data?.item) {
    return (
      <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
        <p className="mx-auto max-w-[1280px] text-sm text-red-600">
          {error?.message || "Event tidak ditemukan."}
        </p>
      </main>
    );
  }

  return (
    <DashboardEventForm
      mode="edit"
      eventId={id}
      initialValues={{
        title: data.item.title,
        category: data.item.category,
        description: data.item.description,
        coverImage: data.item.coverImage,
        eventDate: data.item.eventDate,
        status: data.item.status,
      }}
    />
  );
}
