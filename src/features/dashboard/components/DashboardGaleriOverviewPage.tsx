"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import GaleriPagination from "@/features/galeri/components/GaleriPagination";
import { useDashboardGaleri } from "@/features/galeri/hooks/useDashboardGaleri";

const PAGE_SIZE = 6;

export default function DashboardGaleriOverviewPage() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error } = useDashboardGaleri({
    page,
    limit: PAGE_SIZE,
  });

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
            className="bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
                      onClick={() =>
                        toast("Delete belum diaktifkan untuk galeri.")
                      }
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
    </main>
  );
}
