import type { Metadata } from "next";

import ScrollReveal from "@/components/ScrollReveal";
import EventDetailContainer from "@/features/event/components/EventDetailContainer";
import { createCanonicalMetadataFromSegments } from "@/lib/seo";

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export function generateMetadata({ params }: EventDetailPageProps): Metadata {
  return createCanonicalMetadataFromSegments("event", "read", params.id);
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
