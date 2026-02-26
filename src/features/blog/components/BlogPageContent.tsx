import NewsCard from "@/features/blog/components/NewsCard";
import type { BlogSummary } from "@/features/blog/types";

interface BlogPageContentProps {
  items: BlogSummary[];
}

export default function BlogPageContent({ items }: BlogPageContentProps) {
  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-7">
        {items[0] ? (
          <div className="lg:col-span-4">
            <NewsCard blog={items[0]} variant="large" />
          </div>
        ) : null}
        {items[1] ? (
          <div className="lg:col-span-3">
            <NewsCard blog={items[1]} variant="medium" />
          </div>
        ) : null}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(2).map((blog) => (
          <NewsCard key={blog.id} blog={blog} variant="small" />
        ))}
      </div>
    </>
  );
}
