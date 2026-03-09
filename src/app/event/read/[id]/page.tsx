import EventDetailContainer from "@/features/event/components/EventDetailContainer";

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <EventDetailContainer id={params.id} />
    </main>
  );
}
