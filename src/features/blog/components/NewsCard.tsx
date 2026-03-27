import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { BlogSummary } from "@/features/blog/types";
import clsxm from "@/lib/clsxm";

interface NewsCardProps {
  blog: BlogSummary;
  variant?: "large" | "medium" | "small";
}

export default function NewsCard({ blog, variant = "small" }: NewsCardProps) {
  const titleClass =
    variant === "small" ? "text-xl md:text-2xl" : "text-2xl md:text-3xl";

  const cardHeightClass = variant === "small" ? "" : "h-full";

  return (
    <Link
      href={`/blog/${blog.id}`}
      className={clsxm(
        "group block overflow-hidden border border-brand-blue/35 bg-white",
        cardHeightClass,
        "shadow-[0_3px_0_0_#5172E8] transition-colors duration-300 hover:bg-[#FCEABF]",
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-2 left-2 bg-brand-gold px-3 py-1 text-xs font-medium uppercase text-black">
          {blog.category}
        </span>
      </div>

      <article className="p-4 md:p-5">
        <h2
          className={`line-clamp-2 break-words font-bold leading-tight text-black [overflow-wrap:anywhere] ${titleClass}`}
        >
          {blog.title}
        </h2>
        <p className="mt-3 line-clamp-3 break-words text-[18px]/[1.45] text-black/90 [overflow-wrap:anywhere]">
          {blog.excerpt}
        </p>

        <span
          className={clsxm(
            "mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-blue",
            "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          )}
        >
          Baca Selengkapnya <ArrowRight size={14} />
        </span>
      </article>
    </Link>
  );
}
