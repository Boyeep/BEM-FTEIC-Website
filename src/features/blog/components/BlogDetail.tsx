import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Blog } from "@/features/blog/types";

interface BlogDetailProps {
  blog: Blog;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const publishedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const paragraphs = blog.content.split("\n\n");

  return (
    <article className="mx-auto w-full max-w-6xl bg-white px-6 pb-6 pt-2 md:pb-10 md:pt-4">
      <div className="relative mb-6 h-56 w-full overflow-hidden border border-brand-blue/30 md:h-[360px]">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="h-full w-full object-cover"
        />
        <p className="absolute bottom-3 left-3 inline-flex bg-brand-gold px-3 py-1 text-xs font-medium uppercase text-black">
          {blog.category}
        </p>
      </div>

      <Link
        href="/blog"
        className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase text-brand-blue hover:text-brand-gold md:text-sm"
      >
        <ArrowLeft size={18} />
        Kembali
      </Link>

      <h1 className="mt-1 max-w-5xl text-3xl font-bold leading-tight text-black md:text-5xl">
        {blog.title}
      </h1>
      <div className="mt-5 flex items-center gap-3">
        {blog.authorAvatarUrl ? (
          <img
            src={blog.authorAvatarUrl}
            alt={`${blog.author} avatar`}
            className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold uppercase text-slate-600 md:h-12 md:w-12">
            {blog.author.slice(0, 1)}
          </div>
        )}
        <p className="text-lg text-black/60 md:text-xl">{blog.author}</p>
      </div>
      <div className="mt-5 space-y-4 text-base leading-relaxed text-black md:text-xl">
        {paragraphs.map((paragraph, index) => (
          <p key={`${blog.id}-paragraph-${index}`}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-7 text-xl text-brand-blue md:text-2xl">
        {publishedDate}
      </p>
    </article>
  );
}
