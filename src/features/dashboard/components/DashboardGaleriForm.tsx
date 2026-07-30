"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import ImageCropModal from "@/components/form/ImageCropModal";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { GalleryFormFields } from "@/features/dashboard/components/gallery/GalleryFormFields";
import { useGalleryForm } from "@/features/dashboard/hooks/useGalleryForm";
import { useSaveGallery } from "@/features/dashboard/hooks/useSaveGallery";
import { GaleriDepartment } from "@/features/galeri/types";

interface DashboardGaleriFormProps {
  mode: "create" | "edit";
  galeriId?: string;
  initialValues?: {
    title: string;
    link: string;
    takenAt: string;
    imageUrl: string;
    category: GaleriDepartment;
  };
}

export default function DashboardGaleriForm({
  mode,
  galeriId,
  initialValues,
}: DashboardGaleriFormProps) {
  const { user } = useAuthStore();
  const form = useGalleryForm(initialValues);
  const saveGallery = useSaveGallery();

  const submit = async () => {
    if (!user) {
      toast.error("Kamu harus login terlebih dahulu.");
      return;
    }
    if (!form.isValid) {
      toast.error(
        Object.values(form.errors)[0] || "Lengkapi semua field galeri.",
      );
      return;
    }
    try {
      await saveGallery.mutateAsync({
        mode,
        galleryId: galeriId,
        values: form.values,
        imageFile: form.imageFile,
        user,
      });
      toast.success(
        mode === "create"
          ? "Galeri berhasil dibuat."
          : "Galeri berhasil diperbarui.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan galeri.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-[760px]">
        <Link
          href="/dashboard/galeri/overview"
          className="mb-3 inline-flex min-h-11 items-center gap-2 text-xs uppercase text-black hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ChevronLeft aria-hidden size={14} />
          Back
        </Link>
        <h1 className="mb-6 text-5xl font-extrabold uppercase text-black">
          {mode === "create" ? "CREATE GALLERY" : "EDIT GALLERY"}
        </h1>

        <GalleryFormFields form={form} />

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={saveGallery.isPending}
            className="min-h-11 bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saveGallery.isPending
              ? "Saving..."
              : mode === "create"
                ? "CREATE GALLERY"
                : "SAVE CHANGES"}
          </button>
          <Link
            href="/dashboard/galeri/overview"
            className="inline-flex min-h-11 items-center border border-black/40 px-4 py-2 text-sm text-black hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            DISCARD GALLERY
          </Link>
        </div>
      </section>

      <ImageCropModal
        isOpen={Boolean(form.pendingCropFile)}
        file={form.pendingCropFile}
        title="Sesuaikan Gambar Galeri"
        aspectRatio={16 / 9}
        targetWidth={1600}
        targetHeight={900}
        onCancel={() => form.setPendingCropFile(null)}
        onConfirm={async (croppedFile) => {
          form.setImageFile(croppedFile);
          form.setField("imageUrl", "");
          form.setPendingCropFile(null);
          toast.success("Gambar galeri siap digunakan.");
        }}
      />
    </main>
  );
}
