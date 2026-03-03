"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import Pagination from "@/features/blog/components/Pagination";
import { useDashboardBlogs } from "@/features/blog/hooks/useDashboardBlogs";

const PAGE_SIZE = 8;

export default function DashboardBlogOverviewPage() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error } = useDashboardBlogs({
    page,
    limit: PAGE_SIZE,
  });

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
                <th className="w-[35%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
                  Title
                </th>
                <th className="w-[16%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
                  Department
                </th>
                <th className="w-[12%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
                  Author
                </th>
                <th className="w-[12%] px-3 py-3 text-left text-xs font-medium uppercase text-white">
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
                    {blog.author}
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
                    <Link
                      href={`/dashboard/blog/edit?id=${blog.id}`}
                      aria-label={`Edit ${blog.title}`}
                      className="inline-flex text-black transition-colors hover:text-blue-600"
                    >
                      <Pencil size={14} />
                    </Link>
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
    </main>
  );
}
