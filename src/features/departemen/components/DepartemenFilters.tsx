import { ChevronDown } from "lucide-react";

export default function DepartemenFilters() {
  return (
    <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase text-black/70">
          FILTER BY
        </span>
        <button
          type="button"
          className="flex min-w-44 items-center justify-between border border-black/15 bg-white px-4 py-2 text-sm text-black"
        >
          Date Range
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase text-black/70">
          SORT BY
        </span>
        <button
          type="button"
          className="flex min-w-36 items-center justify-between border border-black/15 bg-white px-4 py-2 text-sm text-black"
        >
          Latest
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
