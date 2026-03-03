import Pagination from "@/features/blog/components/Pagination";

interface GaleriPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function GaleriPagination({
  currentPage,
  totalPages,
  onPageChange,
}: GaleriPaginationProps) {
  return (
    <div className="flex justify-end">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
