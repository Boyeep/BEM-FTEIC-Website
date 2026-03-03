import BlogDetailContainer from "@/features/blog/components/BlogDetailContainer";

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <BlogDetailContainer id={params.id} />
    </main>
  );
}
