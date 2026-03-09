"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { useDashboardBlogs } from "@/features/blog/hooks/useDashboardBlogs";
import { blogService } from "@/features/blog/services/blogService";
import DeleteConfirmModal from "@/features/dashboard/components/DeleteConfirmModal";
import { useDashboardEvents } from "@/features/event/hooks/useDashboardEvents";
import { useVisitorCount } from "@/features/analytics/hooks/useVisitorCount";
import { eventService } from "@/features/event/services/eventService";
import { useDashboardGaleri } from "@/features/galeri/hooks/useDashboardGaleri";
import ActionTable, {
  type ActionRow,
} from "@/features/dashboard/components/ActionTable";
import StatCard from "@/features/dashboard/components/StatCard";

export default function DashboardOverviewPage() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: "blog" | "event";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return;

    setIsDeleting(true);
    try {
      if (deleteTarget.type === "blog") {
        await blogService.deleteBlog(deleteTarget.id);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["dashboard-blogs"] }),
          queryClient.invalidateQueries({ queryKey: ["blogs"] }),
        ]);
        toast.success("Blog berhasil dihapus.");
      } else {
        await eventService.deleteEvent(deleteTarget.id);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["dashboard-events"] }),
          queryClient.invalidateQueries({ queryKey: ["events"] }),
        ]);
        toast.success("Event berhasil dihapus.");
      }
      setDeleteTarget(null);
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus item.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

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
                onDelete={(row) =>
                  setDeleteTarget({ id: row.id, type: "blog" })
                }
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
                onDelete={(row) =>
                  setDeleteTarget({ id: row.id, type: "event" })
                }
                descriptionMaxLines={3}
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
                    value={String(data?.pagination.totalItems || 0)}
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

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        isLoading={isDeleting}
        onCancel={() => {
          if (isDeleting) return;
          setDeleteTarget(null);
        }}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </main>
  );
}
