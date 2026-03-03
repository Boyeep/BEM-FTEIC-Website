import { ArrowUpRight } from "lucide-react";

import ActionTable, {
  type ActionRow,
} from "@/features/dashboard/components/ActionTable";
import StatCard from "@/features/dashboard/components/StatCard";

const recentBlogs: ActionRow[] = [
  {
    id: 1,
    title: "Judul Blog",
    description: "Deskripsi singkat artikel blog terbaru.",
    cover: "/images/Homepage-About-Image.png",
    status: "PUBLISHED",
  },
  {
    id: 2,
    title: "Judul Blog",
    description: "Deskripsi singkat artikel blog terbaru.",
    cover: "/images/Homepage-About-Image.png",
    status: "PUBLISHED",
  },
  {
    id: 3,
    title: "Judul Blog",
    description: "Deskripsi singkat artikel blog terbaru.",
    cover: "/images/Homepage-About-Image.png",
    status: "PUBLISHED",
  },
  {
    id: 4,
    title: "Judul Blog",
    description: "Deskripsi singkat artikel blog terbaru.",
    cover: "/images/Homepage-About-Image.png",
    status: "ARCHIVED",
  },
  {
    id: 5,
    title: "Judul Blog",
    description: "Deskripsi singkat artikel blog terbaru.",
    cover: "/images/Homepage-About-Image.png",
    status: "ARCHIVED",
  },
];

const recentEvents: ActionRow[] = [
  {
    id: 1,
    title: "Judul Event",
    description: "Deskripsi singkat event terkini.",
    cover: "/images/Homepage-About-Image.png",
    status: "ONGOING",
  },
  {
    id: 2,
    title: "Judul Event",
    description: "Deskripsi singkat event terkini.",
    cover: "/images/Homepage-About-Image.png",
    status: "ENDED",
  },
  {
    id: 3,
    title: "Judul Event",
    description: "Deskripsi singkat event terkini.",
    cover: "/images/Homepage-About-Image.png",
    status: "ENDED",
  },
];

export default function DashboardOverviewPage() {
  const galleryCells = [true, true, true, true, true, true, true, true, false];

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-6 text-black md:px-8 md:py-10">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold uppercase tracking-tight text-black md:text-[54px]">
            OVERVIEW
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              + New Blog
            </button>
            <button
              type="button"
              className="bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              + New Event
            </button>
            <button
              type="button"
              className="bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              + Add Photo
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[31px] font-bold uppercase text-black">
                  Recent Blogs
                </h2>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-semibold uppercase text-black transition-colors hover:text-blue-600"
                >
                  View All
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <ActionTable rows={recentBlogs} />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[31px] font-bold uppercase text-black">
                  Recent Events
                </h2>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-semibold uppercase text-black transition-colors hover:text-blue-600"
                >
                  View All
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <ActionTable rows={recentEvents} />
            </section>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-[31px] font-bold uppercase text-black">
                Statistics
              </h2>
              <div className="space-y-4">
                <StatCard label="Visitors" value="12.340" large />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <StatCard label="Blogs Published" value="125" />
                  <StatCard label="Events Hosted" value="50" />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[31px] font-bold uppercase text-black">
                  Galeri
                </h2>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-semibold uppercase text-black transition-colors hover:text-blue-600"
                >
                  View All
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-0 border border-[#E5E7EB] bg-white">
                {galleryCells.map((hasGradient, index) => (
                  <div
                    key={`gallery-${index}`}
                    className={`flex aspect-square items-center justify-center ${hasGradient ? "bg-gradient-to-b from-[#4C78E0] to-[#D5DBE7]" : "bg-white"}`}
                  >
                    {hasGradient ? (
                      <div className="h-12 w-12 rounded-full bg-white/35 md:h-20 md:w-20" />
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
