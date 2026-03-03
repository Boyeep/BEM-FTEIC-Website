"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { useDashboardBlogs } from "@/features/blog/hooks/useDashboardBlogs";
import { useDashboardEvents } from "@/features/event/hooks/useDashboardEvents";
import { useVisitorCount } from "@/features/analytics/hooks/useVisitorCount";
import { useDashboardGaleri } from "@/features/galeri/hooks/useDashboardGaleri";
import ActionTable, {
  type ActionRow,
} from "@/features/dashboard/components/ActionTable";
import StatCard from "@/features/dashboard/components/StatCard";

export default function DashboardOverviewPage() {
  const { data } = useDashboardBlogs({ page: 1, limit: 5 });
  const { data: eventData } = useDashboardEvents({ page: 1, limit: 5 });
  const { data: galeriData } = useDashboardGaleri({ page: 1, limit: 9 });
  const { data: visitorCount } = useVisitorCount();

  const recentBlogs: ActionRow[] =
    data?.items.map((blog) => ({
      id: blog.id,
      title: blog.title,
      description: blog.excerpt,
      cover: blog.coverImage,
      status: blog.status,
    })) || [];
  const recentEvents: ActionRow[] =
    eventData?.items.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      cover: event.coverImage,
      status: event.status,
    })) || [];

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-6 text-black md:px-8 md:py-10">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold uppercase tracking-tight text-black md:text-[54px]">
            OVERVIEW
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/blog/create"
              className="bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              + New Blog
            </Link>
            <Link
              href="/dashboard/event/create"
              className="bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              + New Event
            </Link>
            <Link
              href="/dashboard/galeri/create"
              className="bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              + Add Photo
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[31px] font-bold uppercase text-black">
                  Recent Blogs
                </h2>
                <Link
                  href="/dashboard/blog/overview"
                  className="inline-flex items-center gap-1 text-sm font-semibold uppercase text-black transition-colors hover:text-blue-600"
                >
                  View All
                  <ArrowUpRight size={14} />
                </Link>
              </div>
              <ActionTable
                rows={recentBlogs}
                getEditHref={(row) => `/dashboard/blog/edit?id=${row.id}`}
              />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[31px] font-bold uppercase text-black">
                  Recent Events
                </h2>
                <Link
                  href="/dashboard/event/overview"
                  className="inline-flex items-center gap-1 text-sm font-semibold uppercase text-black transition-colors hover:text-blue-600"
                >
                  View All
                  <ArrowUpRight size={14} />
                </Link>
              </div>
              <ActionTable
                rows={recentEvents}
                getEditHref={(row) => `/dashboard/event/edit?id=${row.id}`}
              />
            </section>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-[31px] font-bold uppercase text-black">
                Statistics
              </h2>
              <div className="space-y-4">
                <StatCard
                  label="Visitors"
                  value={new Intl.NumberFormat("id-ID").format(
                    visitorCount || 0,
                  )}
                  large
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <StatCard
                    label="Blogs Published"
                    value={String(data?.items.length || 0)}
                  />
                  <StatCard
                    label="Events Hosted"
                    value={String(eventData?.pagination.totalItems || 0)}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[31px] font-bold uppercase text-black">
                  Galeri
                </h2>
                <Link
                  href="/dashboard/galeri/overview"
                  className="inline-flex items-center gap-1 text-sm font-semibold uppercase text-black transition-colors hover:text-blue-600"
                >
                  View All
                  <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-0 border border-[#E5E7EB] bg-white">
                {(galeriData?.items || []).map((item) => (
                  <div
                    key={`gallery-${item.id}`}
                    className="flex aspect-square items-center justify-center bg-white"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
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
