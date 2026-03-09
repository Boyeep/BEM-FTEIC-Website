"use client";

import { ChevronLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { blogService } from "@/features/blog/services/blogService";
import { BlogStatus } from "@/features/blog/types";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

const DEPARTMENT_OPTIONS = [
  "FTEIC",
  "TEKNIK ELEKTRO",
  "TEKNIK INFORMATIKA",
  "SISTEM INFORMASI",
  "TEKNIK KOMPUTER",
  "TEKNIK BIOMEDIK",
  "TEKNOLOGI INFORMASI",
];

interface DashboardBlogFormProps {
  mode: "create" | "edit";
  blogId?: string;
  initialValues?: {
    title: string;
    category: string;
    content: string;
    coverImage: string;
    status: BlogStatus;
  };
}

export default function DashboardBlogForm({
  mode,
  blogId,
  initialValues,
}: DashboardBlogFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "FTEIC");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [coverImage, setCoverImage] = useState(initialValues?.coverImage ?? "");
  const [status, setStatus] = useState<BlogStatus>(
    initialValues?.status ?? "PUBLISHED",
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(
    () =>
      title.trim().length > 0 &&
      category.trim().length > 0 &&
      content.trim().length > 0 &&
      (coverImage.trim().length > 0 || Boolean(coverFile)),
    [title, category, content, coverImage, coverFile],
  );

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!user) {
      toast.error("Kamu harus login terlebih dahulu.");
      return;
    }
    if (!isValid) {
      toast.error("Lengkapi semua field blog.");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalCoverImage = coverImage;
      if (coverFile) {
        finalCoverImage = await blogService.uploadCover(user.id, coverFile);
      }

      if (mode === "create") {
        await blogService.createBlog(
          {
            title,
            category,
            content,
            status,
            coverImage: finalCoverImage,
          },
          user.email,
          user.id,
        );
        toast.success("Blog berhasil dibuat.");
      } else {
        if (!blogId) {
          throw new Error("Missing blog id.");
        }
        await blogService.updateBlog(blogId, {
          title,
          category,
          content,
          status,
          coverImage: finalCoverImage,
        });
        toast.success("Blog berhasil diperbarui.");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["blogs"] }),
        queryClient.invalidateQueries({ queryKey: ["blog"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-blogs"] }),
      ]);

      router.push("/dashboard/blog/overview");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan blog.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-[1280px]">
        <Link
          href="/dashboard/blog/overview"
          className="mb-3 inline-flex items-center gap-2 text-xs uppercase text-black hover:text-blue-600"
        >
          <ChevronLeft size={14} />
          Back
        </Link>

        <h1 className="mb-6 text-5xl font-extrabold uppercase text-black">
          {mode === "create" ? "CREATE BLOG" : "EDIT BLOG"}
        </h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="md:col-span-3">
            <label className="mb-2 block text-2xl font-medium text-black">
              TITLE
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter blog title"
              className="h-16 w-full border border-[#C8C8C8] bg-transparent px-4 text-lg text-black placeholder:text-black/55 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-2xl font-medium text-black">
              COVER IMAGE
            </label>
            <label className="flex h-40 cursor-pointer flex-col items-center justify-center border border-[#C8C8C8] text-black/70">
              <Upload size={28} />
              <p className="mt-2 text-sm">Click to upload</p>
              <p className="mt-1 text-xs text-black/45">PNG/JPG/JPEG max 5MB</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const selected = event.target.files?.[0];
                  if (!selected) return;
                  if (!selected.type.startsWith("image/")) {
                    toast.error("File harus berupa gambar.");
                    return;
                  }
                  if (selected.size > 5 * 1024 * 1024) {
                    toast.error("Ukuran gambar maksimal 5MB.");
                    return;
                  }
                  setCoverFile(selected);
                  setCoverImage("");
                }}
              />
            </label>
            {coverFile ? (
              <p className="mt-2 text-xs text-black/70">{coverFile.name}</p>
            ) : null}
            {!coverFile && coverImage ? (
              <p className="mt-2 line-clamp-1 text-xs text-black/70">
                Current: {coverImage}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-2xl font-medium text-black">
              DEPARTMENT
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 w-full border border-[#C8C8C8] bg-transparent px-3 text-sm text-black outline-none"
            >
              {DEPARTMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-2xl font-medium text-black">
              STATUS
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as BlogStatus)}
              className="h-12 w-full border border-[#C8C8C8] bg-transparent px-3 text-sm text-black outline-none"
            >
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-2xl font-medium text-black">
            CONTENT
          </label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your content here..."
            className="h-[380px] w-full resize-none border border-[#C8C8C8] bg-transparent p-4 text-base text-black placeholder:text-black/55 outline-none"
          />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "CREATE BLOG"
                : "SAVE CHANGES"}
          </button>
          <Link
            href="/dashboard/blog/overview"
            className="border border-black/40 px-4 py-2 text-sm text-black hover:bg-black/5"
          >
            DISCARD
          </Link>
        </div>
      </section>
    </main>
  );
}
