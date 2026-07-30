import type { Metadata } from "next";

import ScrollReveal from "@/components/ScrollReveal";
import BlogDetailContainer from "@/features/blog/components/BlogDetailContainer";
import { createCanonicalMetadataFromSegments } from "@/lib/seo";

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  return createCanonicalMetadataFromSegments("blog", (await params).id);
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  return (
    <main className="min-h-screen bg-white pt-28 md:pt-32">
      <ScrollReveal delay={40}>
        <BlogDetailContainer id={(await params).id} />
      </ScrollReveal>
    </main>
  );
}
