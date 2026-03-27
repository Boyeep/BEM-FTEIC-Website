import ScrollReveal from "@/components/ScrollReveal";
import EventDetailContainer from "@/features/event/components/EventDetailContainer";

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <main className="min-h-screen bg-white pt-28 md:pt-32">
      <ScrollReveal delay={40}>
        <EventDetailContainer id={params.id} />
      </ScrollReveal>
    </main>
  );
}
