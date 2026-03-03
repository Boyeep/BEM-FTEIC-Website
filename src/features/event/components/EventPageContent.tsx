import EventCardGrid from "@/features/event/components/EventCardGrid";
import EventFilters from "@/features/event/components/EventFilters";
import EventHeader from "@/features/event/components/EventHeader";
import EventPagination from "@/features/event/components/EventPagination";

export default function EventPageContent() {
  return (
    <main className="min-h-screen bg-[#F3F3F3] px-6 py-16">
      <section className="mx-auto w-full max-w-6xl">
        <EventHeader />
        <EventFilters />
        <EventCardGrid />
        <EventPagination />
      </section>
    </main>
  );
}
