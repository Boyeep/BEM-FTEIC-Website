"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import DeleteConfirmModal from "@/features/dashboard/components/DeleteConfirmModal";
import { galeriService } from "@/features/galeri/services/galeriService";
import GaleriPagination from "@/features/galeri/components/GaleriPagination";
import { useDashboardGaleri } from "@/features/galeri/hooks/useDashboardGaleri";

const PAGE_SIZE = 6;

export default function DashboardGaleriOverviewPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data, isPending, isError, error } = useDashboardGaleri({
    page,
    limit: PAGE_SIZE,
  });

  const handleDelete = async () => {
    if (!selectedDeleteId || isDeleting) return;

    setIsDeleting(true);
    try {
      await galeriService.deleteGaleri(selectedDeleteId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard-galeri"] }),
        queryClient.invalidateQueries({ queryKey: ["galeri"] }),
      ]);
      toast.success("Galeri berhasil dihapus.");
      setSelectedDeleteId(null);
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus galeri.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-[1280px]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold uppercase text-black">
              GALLERY
            </h1>
            <p className="mt-2 text-xl font-medium uppercase text-black">
              {String(data?.pagination.totalItems || 0)} Photos Published
            </p>
          </div>
          <Link
            href="/dashboard/galeri/create"
            className="whitespace-nowrap bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Add Photos
          </Link>
        </div>

        {isPending ? (
          <p className="text-sm text-black/70">Loading photos...</p>
        ) : null}
        {isError ? (
          <p className="text-sm text-red-600">{error.message}</p>
        ) : null}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {data?.items.map((item) => (
            <article key={item.id} className="border border-[#5C84EE] bg-white">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-72 w-full object-cover"
              />
              <div className="p-3">
                <p className="text-3xl font-semibold text-black">
                  {item.title}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <p>{new Date(item.takenAt).toLocaleDateString("en-US")}</p>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/dashboard/galeri/edit?id=${item.id}`}
                      className="inline-flex items-center gap-1 text-[#2B53D3]"
                    >
                      <Pencil size={12} />
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-red-600"
                      onClick={() => setSelectedDeleteId(item.id)}
                    >
                      <Trash2 size={12} />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {data ? (
          <GaleriPagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        ) : null}
      </section>

      <DeleteConfirmModal
        isOpen={Boolean(selectedDeleteId)}
        isLoading={isDeleting}
        onCancel={() => {
          if (isDeleting) return;
          setSelectedDeleteId(null);
        }}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </main>
  );
}
