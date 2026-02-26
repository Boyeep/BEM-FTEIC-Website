import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlogById } from "@/features/blog/api/mock-blogs";
import BlogDetailContainer from "@/features/blog/components/BlogDetailContainer";

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const blog = getBlogById(params.id);

  if (!blog) {
    return {
      title: "Blog Not Found | ELECTICS",
      description: "The requested ELECTICS article does not exist.",
    };
  }

  return {
    title: `${blog.title} | ELECTICS`,
    description: blog.excerpt,
    openGraph: {
      title: `${blog.title} | ELECTICS`,
      description: blog.excerpt,
      images: [{ url: blog.coverImage }],
      type: "article",
    },
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const blog = getBlogById(params.id);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <BlogDetailContainer id={params.id} />
    </main>
  );
}
