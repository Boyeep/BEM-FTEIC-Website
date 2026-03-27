import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Blog } from "@/features/blog/types";
import RichContentBody from "@/features/content/components/RichContentBody";

interface BlogDetailProps {
  blog: Blog;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const publishedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const backLinkClass =
    "mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase text-brand-blue transition-[filter] duration-200 hover:[filter:drop-shadow(0_0_10px_rgba(81,114,232,0.45))] md:text-sm";

  return (
    <article className="mx-auto w-full max-w-6xl bg-white px-6 pb-6 pt-2 md:px-8 md:pb-10 md:pt-4 lg:px-10">
      <div className="relative mx-auto -mt-4 mb-5 aspect-[16/9] w-full max-w-5xl overflow-hidden border border-brand-blue/30 md:-mt-5 md:mb-6">
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
        id="blog-detail-content-start"
        href="/blog"
        className={backLinkClass}
      >
        <ArrowLeft size={18} />
        Kembali
      </Link>

      <h1 className="mt-1 max-w-4xl break-words pb-1 text-[1.75rem] font-bold leading-[1.08] text-black [overflow-wrap:anywhere] md:text-[2.75rem]">
        {blog.title}
      </h1>
      <div className="mt-6 max-w-5xl border-b border-black/10 pb-5 pt-4">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            {blog.authorAvatarUrl ? (
              <img
                src={blog.authorAvatarUrl}
                alt={`${blog.author} avatar`}
                className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10 md:h-12 md:w-12"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold uppercase text-slate-600 sm:h-10 sm:w-10 sm:text-xs md:h-12 md:w-12">
                {blog.author.slice(0, 1)}
              </div>
            )}
            <p className="truncate text-base text-black/60 sm:text-lg md:text-xl">
              {blog.author}
            </p>
          </div>
          <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.12em] text-black/45 sm:text-sm sm:text-right">
            {publishedDate}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <RichContentBody content={blog.content} />
      </div>
    </article>
  );
}
