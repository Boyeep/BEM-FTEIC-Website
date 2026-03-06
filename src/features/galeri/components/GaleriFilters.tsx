import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  GaleriDepartment,
  GaleriOrientation,
  GaleriSortBy,
} from "@/features/galeri/types";

interface GaleriFiltersProps {
  onSortChange: (sortBy: GaleriSortBy) => void;
  onDepartmentChange: (department: GaleriDepartment) => void;
  onOrientationChange: (orientation: GaleriOrientation) => void;
}

export default function GaleriFilters({
  onSortChange,
  onDepartmentChange,
  onOrientationChange,
}: GaleriFiltersProps) {
  const [sortBy, setSortBy] = useState<GaleriSortBy>("latest");
  const [department, setDepartment] = useState<GaleriDepartment>("all");
  const [orientation, setOrientation] = useState<GaleriOrientation>("all");

  useEffect(() => {
    onSortChange(sortBy);
  }, [sortBy, onSortChange]);

  useEffect(() => {
    onDepartmentChange(department);
  }, [department, onDepartmentChange]);

  useEffect(() => {
    onOrientationChange(orientation);
  }, [orientation, onOrientationChange]);

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-3 sm:gap-2 md:flex-row md:items-center md:gap-3">
        <span className="text-xs font-semibold uppercase text-black/70">
          FILTER BY
        </span>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-2 md:w-auto md:gap-3">
          <label className="relative inline-flex">
            <select
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value as GaleriDepartment)
              }
              className="w-full appearance-none border border-black/15 bg-white px-4 py-2 pr-9 text-sm text-black sm:min-w-44 md:w-auto"
            >
              <option value="all">Departemen</option>
              <option value="teknik_elektro">Teknik Elektro</option>
              <option value="teknik_informatika">Teknik Informatika</option>
              <option value="sistem_informasi">Sistem Informasi</option>
              <option value="teknik_komputer">Teknik Komputer</option>
              <option value="teknik_biomedik">Teknik Biomedik</option>
              <option value="teknologi_informasi">Teknologi Informasi</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
            />
          </label>
          <label className="relative inline-flex">
            <select
              value={orientation}
              onChange={(event) =>
                setOrientation(event.target.value as GaleriOrientation)
              }
              className="w-full appearance-none border border-black/15 bg-white px-4 py-2 pr-9 text-sm text-black sm:min-w-36 md:w-auto"
            >
              <option value="all">Orientation</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
              <option value="square">Square</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-2 md:flex-row md:items-center md:gap-3">
        <span className="text-xs font-semibold uppercase text-black/70">
          SORT BY
        </span>
        <label className="relative inline-flex w-full sm:max-w-[280px] md:w-auto">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as GaleriSortBy)}
            className="w-full appearance-none border border-black/15 bg-white px-4 py-2 pr-9 text-sm text-black sm:min-w-[260px] md:w-auto"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="title_asc">Alphabetical (A-Z)</option>
            <option value="title_desc">Alphabetical (Z-A)</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
          />
        </label>
      </div>
    </div>
  );
}
