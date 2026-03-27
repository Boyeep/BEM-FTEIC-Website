import ScrollReveal from "@/components/ScrollReveal";
import BlogDetailContainer from "@/features/blog/components/BlogDetailContainer";

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  return (
    <main className="min-h-screen bg-white pt-28 md:pt-32">
      <ScrollReveal delay={40}>
        <BlogDetailContainer id={params.id} />
      </ScrollReveal>
    </main>
  );
}
