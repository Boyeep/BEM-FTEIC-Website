"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { blogService } from "@/features/blog/services/blogService";
import Pagination from "@/features/blog/components/Pagination";
import { useDashboardBlogs } from "@/features/blog/hooks/useDashboardBlogs";
import DeleteConfirmModal from "@/features/dashboard/components/DeleteConfirmModal";

const PAGE_SIZE = 8;

export default function DashboardBlogOverviewPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data, isPending, isError, error } = useDashboardBlogs({
    page,
    limit: PAGE_SIZE,
  });

  const handleDelete = async () => {
    if (!selectedDeleteId || isDeleting) return;

    setIsDeleting(true);
    try {
      await blogService.deleteBlog(selectedDeleteId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard-blogs"] }),
        queryClient.invalidateQueries({ queryKey: ["blogs"] }),
      ]);
      toast.success("Blog berhasil dihapus.");
      setSelectedDeleteId(null);
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus blog.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-[1280px]">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold uppercase text-black">BLOG</h1>
          <Link
            href="/dashboard/blog/create"
            className="bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + New Blog
          </Link>
        </div>

        <div className="overflow-x-auto border border-[#B8B8B8] bg-white">
          <table className="w-full min-w-[980px] table-fixed">
            <thead className="bg-black">
              <tr>
                <th className="w-[10%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
                  Cover
                </th>
                <th className="w-[33%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
                  Title
                </th>
                <th className="w-[16%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
                  Department
                </th>
                <th className="w-[14%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
                  Author
                </th>
                <th className="w-[10%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
                  Date Published
                </th>
                <th className="w-[8%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
                  Status
                </th>
                <th className="w-[7%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-sm text-black/70">
                    Loading blogs...
                  </td>
                </tr>
              ) : null}

              {isError ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-sm text-red-600">
                    {error.message}
                  </td>
                </tr>
              ) : null}

              {data?.items.map((blog) => (
                <tr key={blog.id} className="border-b border-[#D0D0D0]">
                  <td className="px-3 py-2">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-[48px] w-[66px] object-cover"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm font-semibold text-black">
                      {blog.title}
                    </p>
                    <p className="line-clamp-1 text-xs text-black/65">
                      {blog.excerpt}
                    </p>
                  </td>
                  <td className="px-3 py-2 text-xs text-black">
                    {blog.category}
                  </td>
                  <td className="px-3 py-2 text-xs text-black">
                    <span className="block truncate">{blog.author}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-black">
                    {new Date(blog.publishedAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-3 py-2">
                    <span className="border border-[#436FFF] px-2 py-0.5 text-[10px] uppercase text-[#436FFF]">
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/blog/edit?id=${blog.id}`}
                        aria-label={`Edit ${blog.title}`}
                        className="inline-flex text-black transition-colors hover:text-blue-600"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${blog.title}`}
                        className="inline-flex text-black transition-colors hover:text-red-600"
                        onClick={() => setSelectedDeleteId(blog.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data ? (
          <Pagination
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
