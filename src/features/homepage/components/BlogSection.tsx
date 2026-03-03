"use client";

import Link from "next/link";

import { useBlogs } from "@/features/blog/hooks/useBlogs";

export default function BlogSection() {
  const { data } = useBlogs({ page: 1, limit: 5 });
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
            className="text-sm font-medium uppercase hover:text-white/80 md:text-base"
          >
            LIHAT SEMUA ↗
          </Link>
        </div>

        {highlight ? (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <article className="lg:col-span-7">
              <Link href={`/blog/${highlight.id}`}>
                <div className="relative h-72 w-full overflow-hidden md:h-80">
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
              <h4 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
                {highlight.title}
              </h4>
              <p className="mt-4 text-xl leading-relaxed text-white/85 md:text-2xl">
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
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#FCD704]">
                      {blog.category}
                    </p>
                    <h5 className="mt-1 line-clamp-2 text-3xl font-bold leading-tight md:text-4xl">
                      {blog.title}
                    </h5>
                    <p className="mt-1 line-clamp-2 text-sm text-white/90 md:text-base">
                      {blog.excerpt}
                    </p>
                    <Link
                      href={`/blog/${blog.id}`}
                      className="mt-2 inline-block text-sm font-medium uppercase text-white/95"
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
