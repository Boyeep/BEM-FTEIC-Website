import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DepartemenPagination() {
  return (
    <nav className="mt-12 flex items-center justify-end gap-5 text-sm text-black">
      <button type="button" className="hover:text-[#1D4ED8]">
        <ChevronLeft size={16} />
      </button>
      <button type="button" className="font-medium text-black">
        1
      </button>
      <button type="button" className="text-black/70 hover:text-[#1D4ED8]">
        2
      </button>
      <button type="button" className="text-black/70 hover:text-[#1D4ED8]">
        3
      </button>
      <span className="text-black/70">...</span>
      <span className="text-black/70">n</span>
      <button type="button" className="hover:text-[#1D4ED8]">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
