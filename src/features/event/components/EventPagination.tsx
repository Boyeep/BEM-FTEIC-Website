import Pagination from "@/features/blog/components/Pagination";

interface EventPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function EventPagination({
  currentPage,
  totalPages,
  onPageChange,
}: EventPaginationProps) {
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
