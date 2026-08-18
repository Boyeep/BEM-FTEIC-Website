import Link from "next/link";

import ScrollReveal from "@/components/ScrollReveal";
import { getBlogs } from "@/features/blog/api/get-blogs";
import type { BlogSummary } from "@/features/blog/types";

export default async function BlogSection() {
  let items: BlogSummary[] = [];
  let loadFailed = false;

  try {
    const data = await getBlogs({ page: 1, limit: 5 });
    items = data.items;
  } catch {
    loadFailed = true;
  }

  const highlight = items[0];
  const rest = items.slice(1, 5);

  return (
    <section className="bg-[#1D4ED8] pb-36 pt-20 text-white">
      <div className="mx-auto max-w-6xl translate-y-10 px-6">
        <ScrollReveal delay={40}>
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
        </ScrollReveal>

        {highlight ? (
          <ScrollReveal delay={80}>
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <article className="lg:col-span-7">
                <Link href={`/blog/${highlight.id}`} className="group block">
                  <div className="relative h-88 w-full overflow-hidden md:h-[28rem]">
                    <img
                      src={highlight.coverImage}
                      alt={highlight.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <Link href={`/blog/${blog.id}`} className="group block">
                      <div className="relative h-24 w-44 shrink-0 overflow-hidden md:h-28 md:w-48">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={80}>
            <p className="mt-8 text-sm text-white/90">
              {loadFailed
                ? "Blog terbaru belum dapat dimuat. Silakan coba lagi nanti."
                : "Belum ada blog terbaru."}
            </p>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
