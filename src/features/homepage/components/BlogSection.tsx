"use client";

import Link from "next/link";

import { useBlogs } from "@/features/blog/hooks/useBlogs";

export default function BlogSection() {
  const { data, isPending } = useBlogs({ page: 1, limit: 5 });
  const items = data?.items ?? [];
  const highlight = items[0];
  const rest = items.slice(1, 5);

  return (
    <section className="bg-[#1D4ED8] pb-36 pt-20 text-white">
      <div className="mx-auto max-w-6xl translate-y-10 px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-4xl font-extrabold uppercase text-[#FCD704] md:text-5xl">
            BLOG
          </h3>
          <Link
            href="/blog"
            className="relative text-sm font-medium uppercase hover:text-white/80 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full md:text-base"
          >
            LIHAT SEMUA ↗
          </Link>
        </div>

        {isPending ? (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <article className="lg:col-span-7">
              <div className="h-88 w-full animate-pulse bg-white/20 md:h-[28rem]" />
              <div className="mt-4 h-4 w-24 animate-pulse bg-white/20" />
              <div className="mt-3 h-10 w-4/5 animate-pulse bg-white/20" />
              <div className="mt-3 h-6 w-full animate-pulse bg-white/20" />
              <div className="mt-2 h-6 w-3/4 animate-pulse bg-white/20" />
            </article>

            <div className="space-y-5 lg:col-span-5">
              {Array.from({ length: 4 }).map((_, idx) => (
                <article
                  key={`blog-home-skeleton-${idx}`}
                  className="flex gap-4"
                >
                  <div className="h-24 w-44 shrink-0 animate-pulse bg-white/20 md:h-28 md:w-48" />
                  <div className="w-full">
                    <div className="h-3 w-20 animate-pulse bg-white/20" />
                    <div className="mt-2 h-8 w-5/6 animate-pulse bg-white/20" />
                    <div className="mt-2 h-4 w-full animate-pulse bg-white/20" />
                    <div className="mt-1 h-4 w-3/4 animate-pulse bg-white/20" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : highlight ? (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <article className="lg:col-span-7">
              <Link href={`/blog/${highlight.id}`}>
                <div className="relative h-88 w-full overflow-hidden md:h-[28rem]">
                  <img
                    src={highlight.coverImage}
                    alt={highlight.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
              <p className="mt-4 text-sm font-semibold uppercase text-[#FCD704]">
                {highlight.category}
              </p>
              <h4 className="mt-2 line-clamp-2 break-words text-2xl font-bold leading-tight [overflow-wrap:anywhere] md:text-3xl">
                {highlight.title}
              </h4>
              <p className="mt-4 break-words text-lg leading-relaxed text-white/85 [overflow-wrap:anywhere] md:text-xl">
                {highlight.excerpt}
              </p>
            </article>

            <div className="space-y-5 lg:col-span-5">
              {rest.map((blog) => (
                <article key={blog.id} className="flex gap-4">
                  <Link href={`/blog/${blog.id}`}>
                    <div className="relative h-24 w-44 shrink-0 overflow-hidden md:h-28 md:w-48">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-[#FCD704]">
                      {blog.category}
                    </p>
                    <h5 className="mt-1 line-clamp-2 break-words text-lg font-bold leading-tight [overflow-wrap:anywhere] md:text-xl">
                      {blog.title}
                    </h5>
                    <p className="mt-1 line-clamp-2 break-words text-sm text-white/90 [overflow-wrap:anywhere] md:text-base">
                      {blog.excerpt}
                    </p>
                    <Link
                      href={`/blog/${blog.id}`}
                      className="relative mt-2 inline-block text-sm font-medium uppercase text-white/95 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full"
                    >
                      BACA ↗
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-white/90">Belum ada blog terbaru.</p>
        )}
      </div>
    </section>
  );
}
