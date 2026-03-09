import EventDetailContainer from "@/features/event/components/EventDetailContainer";

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <main className="min-h-screen bg-white pt-6 md:pt-10">
      <EventDetailContainer id={params.id} />
    </main>
  );
}
