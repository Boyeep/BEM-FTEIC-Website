import NewsCardSkeleton from "@/features/blog/components/NewsCardSkeleton";

interface BlogPageLoadingGridProps {
  size: number;
}

export default function BlogPageLoadingGrid({
  size,
}: BlogPageLoadingGridProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: size }, (_, index) => (
        <NewsCardSkeleton key={`blog-skeleton-${index}`} />
      ))}
    </div>
  );
}
