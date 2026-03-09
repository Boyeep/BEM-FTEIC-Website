import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import Badge from "@/features/dashboard/components/Badge";

export type ActionStatus = "PUBLISHED" | "ARCHIVED" | "ONGOING" | "ENDED";

export interface ActionRow {
  id: string;
  title: string;
  description: string;
  cover: string;
  status: ActionStatus;
}

interface ActionTableProps {
  rows: ActionRow[];
  getEditHref?: (row: ActionRow) => string;
  onDelete?: (row: ActionRow) => void;
  descriptionMaxLines?: number;
}

function toBadgeVariant(status: ActionStatus) {
  switch (status) {
    case "PUBLISHED":
      return "published";
    case "ARCHIVED":
      return "archived";
    case "ONGOING":
      return "ongoing";
    case "ENDED":
      return "ended";
  }
}

export default function ActionTable({
  rows,
  getEditHref,
  onDelete,
  descriptionMaxLines,
}: ActionTableProps) {
  return (
    <div className="overflow-x-auto border border-[#E5E7EB] bg-white">
      <table className="w-full min-w-[620px] table-fixed">
        <thead className="bg-black">
          <tr>
            <th className="w-[16%] px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-white">
              Cover
            </th>
            <th className="w-[53%] px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-white">
              Title
            </th>
            <th className="w-[16%] px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-white">
              Status
            </th>
            <th className="w-[15%] px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[#E5E7EB] transition-colors hover:bg-slate-50"
            >
              <td className="px-4 py-3 align-middle">
                <div className="relative h-[52px] w-[66px] overflow-hidden">
                  {row.cover ? (
                    <img
                      src={row.cover}
                      alt={row.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-200" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 align-middle">
                <p className="text-base font-semibold text-black">
                  {row.title}
                </p>
                <p
                  className="text-sm text-gray-500"
                  style={
                    descriptionMaxLines
                      ? {
                          display: "-webkit-box",
                          WebkitLineClamp: descriptionMaxLines,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }
                      : undefined
                  }
                >
                  {row.description}
                </p>
              </td>
              <td className="px-4 py-3 align-middle">
                <Badge
                  label={row.status}
                  variant={toBadgeVariant(row.status)}
                />
              </td>
              <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-3 text-black">
                  {getEditHref ? (
                    <Link
                      href={getEditHref(row)}
                      aria-label={`Edit ${row.title}`}
                      className="inline-flex transition-colors hover:text-blue-600"
                    >
                      <Pencil size={16} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Edit ${row.title}`}
                      className="transition-colors hover:text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={`Delete ${row.title}`}
                    className="transition-colors hover:text-red-600"
                    onClick={() => onDelete?.(row)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
