import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { EventSortBy } from "@/features/event/types";

type DateRangePreset =
  | "all"
  | "this_week"
  | "this_month"
  | "this_year"
  | "custom";

interface EventFiltersProps {
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onSortChange: (sortBy: EventSortBy) => void;
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = (day + 6) % 7;
  next.setDate(next.getDate() - diff);
  return next;
}

function endOfWeek(date: Date) {
  const next = startOfWeek(date);
  next.setDate(next.getDate() + 6);
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date: Date) {
  return new Date(date.getFullYear(), 11, 31);
}

export default function EventFilters({
  onDateRangeChange,
  onSortChange,
}: EventFiltersProps) {
  const [preset, setPreset] = useState<DateRangePreset>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [sortBy, setSortBy] = useState<EventSortBy>("latest");

  useEffect(() => {
    const now = new Date();

    if (preset === "all") {
      onDateRangeChange({});
      return;
    }

    if (preset === "this_week") {
      onDateRangeChange({
        startDate: toIsoDate(startOfWeek(now)),
        endDate: toIsoDate(endOfWeek(now)),
      });
      return;
    }

    if (preset === "this_month") {
      onDateRangeChange({
        startDate: toIsoDate(startOfMonth(now)),
        endDate: toIsoDate(endOfMonth(now)),
      });
      return;
    }

    if (preset === "this_year") {
      onDateRangeChange({
        startDate: toIsoDate(startOfYear(now)),
        endDate: toIsoDate(endOfYear(now)),
      });
      return;
    }

    onDateRangeChange({
      startDate: customStartDate || undefined,
      endDate: customEndDate || undefined,
    });
  }, [preset, customStartDate, customEndDate, onDateRangeChange]);

  useEffect(() => {
    onSortChange(sortBy);
  }, [sortBy, onSortChange]);

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase text-black/70">
            FILTER BY
          </span>
          <label className="relative inline-flex">
            <select
              value={preset}
              onChange={(event) =>
                setPreset(event.target.value as DateRangePreset)
              }
              className="w-[180px] appearance-none border border-black/15 bg-white px-4 py-2 pr-9 text-sm text-black sm:w-[220px]"
            >
              <option value="all">Date Range</option>
              <option value="this_week">Minggu ini</option>
              <option value="this_month">Bulan ini</option>
              <option value="this_year">Tahun ini</option>
              <option value="custom">Custom range</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-black"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase text-black/70">
            SORT BY
          </span>
          <label className="relative inline-flex">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as EventSortBy)}
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

      {preset === "custom" ? (
        <div className="flex flex-row items-center gap-2 sm:gap-3">
          <input
            type="date"
            value={customStartDate}
            onChange={(event) => setCustomStartDate(event.target.value)}
            className="w-[150px] border border-black/15 bg-white px-4 py-2 text-sm text-black sm:w-[220px]"
            aria-label="Start date"
          />
          <input
            type="date"
            value={customEndDate}
            onChange={(event) => setCustomEndDate(event.target.value)}
            className="w-[150px] border border-black/15 bg-white px-4 py-2 text-sm text-black sm:w-[220px]"
            aria-label="End date"
          />
        </div>
      ) : null}
    </div>
  );
}
