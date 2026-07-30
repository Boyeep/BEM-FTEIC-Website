"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import ImageCropModal from "@/components/form/ImageCropModal";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { blogService } from "@/features/blog/services/blogService";
import { BlogStatus } from "@/features/blog/types";
import RichContentEditor from "@/features/dashboard/components/RichContentEditor";
import { BlogFormFields } from "@/features/dashboard/components/blog/BlogFormFields";
import { useBlogForm } from "@/features/dashboard/hooks/useBlogForm";
import { useSaveBlog } from "@/features/dashboard/hooks/useSaveBlog";

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
  const { user } = useAuthStore();
  const form = useBlogForm(initialValues);
  const saveBlog = useSaveBlog();

  const handleSubmit = async () => {
    if (saveBlog.isPending) return;
    if (!user) {
      toast.error("Kamu harus login terlebih dahulu.");
      return;
    }
    if (!form.isValid) {
      toast.error(
        Object.values(form.errors)[0] || "Lengkapi semua field blog.",
      );
      return;
    }

    try {
      await saveBlog.mutateAsync({
        mode,
        blogId,
        values: form.values,
        coverFile: form.coverFile,
        user,
      });
      toast.success(
        mode === "create"
          ? "Blog berhasil dibuat."
          : "Blog berhasil diperbarui.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan blog.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-[1280px]">
        <Link
          href="/dashboard/blog/overview"
          className="mb-3 inline-flex min-h-11 items-center gap-2 text-xs uppercase text-black hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ChevronLeft aria-hidden size={14} />
          Back
        </Link>

        <h1 className="mb-6 text-5xl font-extrabold uppercase text-black">
          {mode === "create" ? "CREATE BLOG" : "EDIT BLOG"}
        </h1>

        <BlogFormFields form={form} />

        <RichContentEditor
          label="CONTENT"
          value={form.values.content}
          onChange={(value) => form.setField("content", value)}
          placeholder="Write your blog content here..."
          disabled={saveBlog.isPending}
          onUploadImage={async (file) => {
            if (!user) {
              throw new Error("Kamu harus login terlebih dahulu.");
            }
            return blogService.uploadContentImage(user.id, file);
          }}
        />
        {form.errors.content ? (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {form.errors.content}
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saveBlog.isPending}
            className="min-h-11 bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saveBlog.isPending
              ? "Saving..."
              : mode === "create"
                ? "CREATE BLOG"
                : "SAVE CHANGES"}
          </button>
          <Link
            href="/dashboard/blog/overview"
            className="inline-flex min-h-11 items-center border border-black/40 px-4 py-2 text-sm text-black hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            DISCARD
          </Link>
        </div>
      </section>

      <ImageCropModal
        isOpen={Boolean(form.pendingCropFile)}
        file={form.pendingCropFile}
        title="Sesuaikan Cover Blog"
        aspectRatio={16 / 9}
        targetWidth={1600}
        targetHeight={900}
        onCancel={() => form.setPendingCropFile(null)}
        onConfirm={async (croppedFile) => {
          form.setCoverFile(croppedFile);
          form.setField("coverImage", "");
          form.setPendingCropFile(null);
          toast.success("Cover blog siap digunakan.");
        }}
      />
    </main>
  );
}
