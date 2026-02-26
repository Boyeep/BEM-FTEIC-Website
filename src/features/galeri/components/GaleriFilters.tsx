import { ChevronDown } from "lucide-react";

export default function GaleriFilters() {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-3 sm:gap-2 md:flex-row md:items-center md:gap-3">
        <span className="text-xs font-semibold uppercase text-black/70">
          FILTER BY
        </span>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-2 md:w-auto md:gap-3">
          <button
            type="button"
            className="flex w-full items-center justify-between border border-black/15 bg-white px-4 py-2 text-sm text-black sm:min-w-44 md:w-auto"
          >
            Department
            <ChevronDown size={16} />
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-between border border-black/15 bg-white px-4 py-2 text-sm text-black sm:min-w-36 md:w-auto"
          >
            Orientation
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-2 md:flex-row md:items-center md:gap-3">
        <span className="text-xs font-semibold uppercase text-black/70">
          SORT BY
        </span>
        <button
          type="button"
          className="flex w-full items-center justify-between border border-black/15 bg-white px-4 py-2 text-sm text-black sm:max-w-[220px] sm:min-w-36 md:w-auto"
        >
          Latest
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
