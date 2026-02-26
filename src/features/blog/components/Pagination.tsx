import { ChevronLeft, ChevronRight } from "lucide-react";

import clsxm from "@/lib/clsxm";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | "...";

function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <nav className="mt-14 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={clsxm(
          "text-black transition-colors",
          currentPage === 1
            ? "cursor-not-allowed opacity-30"
            : "hover:text-brand-blue",
        )}
      >
        <ChevronLeft size={18} />
      </button>

      {pageItems.map((item, index) => {
        if (item === "...") {
          return (
            <span key={`ellipsis-${index}`} className="text-sm text-black">
              ...
            </span>
          );
        }

        const isActive = item === currentPage;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={isActive ? "page" : undefined}
            className={clsxm(
              "min-w-6 text-sm transition-colors",
              isActive
                ? "font-medium text-brand-blue"
                : "text-black hover:text-brand-blue",
            )}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={clsxm(
          "text-black transition-colors",
          currentPage === totalPages
            ? "cursor-not-allowed opacity-30"
            : "hover:text-brand-blue",
        )}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
