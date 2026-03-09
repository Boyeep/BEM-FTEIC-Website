"use client";

import { ChevronLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { galeriService } from "@/features/galeri/services/galeriService";

interface DashboardGaleriFormProps {
  mode: "create" | "edit";
  galeriId?: string;
  initialValues?: {
    title: string;
    link: string;
    takenAt: string;
    imageUrl: string;
  };
}

export default function DashboardGaleriForm({
  mode,
  galeriId,
  initialValues,
}: DashboardGaleriFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [link, setLink] = useState(initialValues?.link ?? "");
  const [takenAt, setTakenAt] = useState(
    initialValues?.takenAt?.slice(0, 10) ?? "",
  );
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(
    () =>
      title.trim().length > 0 &&
      link.trim().length > 0 &&
      takenAt.trim().length > 0 &&
      (imageUrl.trim().length > 0 || Boolean(imageFile)),
    [title, link, takenAt, imageUrl, imageFile],
  );

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!user) {
      toast.error("Kamu harus login terlebih dahulu.");
      return;
    }
    if (!isValid) {
      toast.error("Lengkapi semua field galeri.");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await galeriService.uploadImage(user.id, imageFile);
      }

      if (mode === "create") {
        await galeriService.createGaleri(
          {
            title,
            link,
            takenAt,
            imageUrl: finalImageUrl,
          },
          user.id,
        );
        toast.success("Galeri berhasil dibuat.");
      } else {
        if (!galeriId) throw new Error("Missing galeri id.");
        await galeriService.updateGaleri(galeriId, {
          title,
          link,
          takenAt,
          imageUrl: finalImageUrl,
        });
        toast.success("Galeri berhasil diperbarui.");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["galeri"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-galeri"] }),
      ]);

      router.push("/dashboard/galeri/overview");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan galeri.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-[760px]">
        <Link
          href="/dashboard/galeri/overview"
          className="mb-3 inline-flex items-center gap-2 text-xs uppercase text-black hover:text-blue-600"
        >
          <ChevronLeft size={14} />
          Back
        </Link>

        <h1 className="mb-6 text-5xl font-extrabold uppercase text-black">
          {mode === "create" ? "CREATE GALLERY" : "EDIT GALLERY"}
        </h1>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-2xl font-medium text-black">
              TITLE
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter event title"
              className="h-16 w-full border border-[#C8C8C8] bg-transparent px-4 text-lg text-black placeholder:text-black/55 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-2xl font-medium text-black">
              LINK
            </label>
            <input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="Enter the link for the photo"
              className="h-12 w-full border border-[#C8C8C8] bg-transparent px-4 text-base text-black placeholder:text-black/55 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-2xl font-medium text-black">
              DATE
            </label>
            <input
              type="date"
              value={takenAt}
              onChange={(event) => setTakenAt(event.target.value)}
              className="h-12 w-[260px] border border-[#C8C8C8] bg-transparent px-3 text-sm text-black outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-2xl font-medium text-black">
              COVER IMAGE
            </label>
            <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center border border-[#C8C8C8] text-black/70">
              <Upload size={28} />
              <p className="mt-2 text-sm">Click to upload or drag and drop</p>
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
                  setImageFile(selected);
                  setImageUrl("");
                }}
              />
            </label>
          </div>
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
                ? "CREATE GALLERY"
                : "SAVE CHANGES"}
          </button>
          <Link
            href="/dashboard/galeri/overview"
            className="border border-black/40 px-4 py-2 text-sm text-black hover:bg-black/5"
          >
            DISCARD GALLERY
          </Link>
        </div>
      </section>
    </main>
  );
}
