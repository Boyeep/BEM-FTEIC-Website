import type { Metadata } from "next";

import ScrollReveal from "@/components/ScrollReveal";
import EventDetailContainer from "@/features/event/components/EventDetailContainer";
import { createCanonicalMetadataFromSegments } from "@/lib/seo";

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  return createCanonicalMetadataFromSegments(
    "event",
    "read",
    (await params).id,
  );
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  return (
    <main className="min-h-screen bg-white pt-28 md:pt-32">
      <ScrollReveal delay={40}>
        <EventDetailContainer id={(await params).id} />
      </ScrollReveal>
    </main>
  );
}
