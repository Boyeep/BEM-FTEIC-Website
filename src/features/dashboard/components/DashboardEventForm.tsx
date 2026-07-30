"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import ImageCropModal from "@/components/form/ImageCropModal";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import RichContentEditor from "@/features/dashboard/components/RichContentEditor";
import { EventFormFields } from "@/features/dashboard/components/event/EventFormFields";
import { useEventForm } from "@/features/dashboard/hooks/useEventForm";
import { useSaveEvent } from "@/features/dashboard/hooks/useSaveEvent";
import { eventService } from "@/features/event/services/eventService";
import { EventStatus, PublicationStatus } from "@/features/event/types";

interface DashboardEventFormProps {
  mode: "create" | "edit";
  eventId?: string;
  initialValues?: {
    title: string;
    category: string;
    description: string;
    coverImage: string;
    eventDate: string;
    status: EventStatus;
    publicationStatus: PublicationStatus;
  };
}

export default function DashboardEventForm({
  mode,
  eventId,
  initialValues,
}: DashboardEventFormProps) {
  const { user } = useAuthStore();
  const form = useEventForm(initialValues);
  const saveEvent = useSaveEvent();

  const submit = async () => {
    if (!user) {
      toast.error("Kamu harus login terlebih dahulu.");
      return;
    }
    if (!form.isValid) {
      toast.error(
        Object.values(form.errors)[0] || "Lengkapi semua field event.",
      );
      return;
    }
    try {
      await saveEvent.mutateAsync({
        mode,
        eventId,
        values: form.values,
        coverFile: form.coverFile,
        user,
      });
      toast.success(
        mode === "create"
          ? "Event berhasil dibuat."
          : "Event berhasil diperbarui.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan event.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-[1280px]">
        <Link
          href="/dashboard/event/overview"
          className="mb-3 inline-flex min-h-11 items-center gap-2 text-xs uppercase text-black hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ChevronLeft aria-hidden size={14} />
          Back
        </Link>
        <h1 className="mb-6 text-5xl font-extrabold uppercase text-black">
          {mode === "create" ? "CREATE EVENT" : "EDIT EVENT"}
        </h1>

        <EventFormFields form={form} />

        <RichContentEditor
          label="DESCRIPTION"
          value={form.values.description}
          onChange={(value) => form.setField("description", value)}
          placeholder="Write event description here..."
          disabled={saveEvent.isPending}
          minHeightClass="h-[360px]"
          onUploadImage={async (file) => {
            if (!user) throw new Error("Kamu harus login terlebih dahulu.");
            return eventService.uploadContentImage(user.id, file);
          }}
        />
        {form.errors.description ? (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {form.errors.description}
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={saveEvent.isPending}
            className="min-h-11 bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saveEvent.isPending
              ? "Saving..."
              : mode === "create"
                ? "CREATE EVENT"
                : "SAVE CHANGES"}
          </button>
          <Link
            href="/dashboard/event/overview"
            className="inline-flex min-h-11 items-center border border-black/40 px-4 py-2 text-sm text-black hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            DISCARD
          </Link>
        </div>
      </section>

      <ImageCropModal
        isOpen={Boolean(form.pendingCropFile)}
        file={form.pendingCropFile}
        title="Sesuaikan Cover Event"
        aspectRatio={16 / 9}
        targetWidth={1600}
        targetHeight={900}
        onCancel={() => form.setPendingCropFile(null)}
        onConfirm={async (croppedFile) => {
          form.setCoverFile(croppedFile);
          form.setField("coverImage", "");
          form.setPendingCropFile(null);
          toast.success("Cover event siap digunakan.");
        }}
      />
    </main>
  );
}
