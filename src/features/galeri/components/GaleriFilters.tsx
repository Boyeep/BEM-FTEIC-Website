import { ChevronDown } from "lucide-react";
import { GaleriSortBy } from "@/features/galeri/types";

interface GaleriFiltersProps {
  onSortChange: (sortBy: GaleriSortBy) => void;
}

export default function GaleriFilters({ onSortChange }: GaleriFiltersProps) {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase text-black/70">
          SORT BY
        </span>
        <label className="relative inline-flex">
          <select
            defaultValue="latest"
            onChange={(event) =>
              onSortChange(event.target.value as GaleriSortBy)
            }
            className="w-[180px] appearance-none border border-black/15 bg-white px-4 py-2 pr-9 text-sm text-black sm:w-[220px]"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="title_asc">Alphabetical (A-Z)</option>
            <option value="title_desc">Alphabetical (Z-A)</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-black"
          />
        </label>
      </div>
    </div>
  );
}
