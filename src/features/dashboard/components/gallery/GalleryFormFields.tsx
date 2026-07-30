"use client";

import { ChevronDown, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { useGalleryForm } from "@/features/dashboard/hooks/useGalleryForm";
import { GaleriDepartment } from "@/features/galeri/types";

const departments: GaleriDepartment[] = [
  "all",
  "teknik_elektro",
  "teknik_informatika",
  "sistem_informasi",
  "teknik_komputer",
  "teknik_biomedik",
  "teknologi_informasi",
];

export function GalleryFormFields({
  form,
}: {
  form: ReturnType<typeof useGalleryForm>;
}) {
  const chooseImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5MB.");
      return;
    }
    form.setPendingCropFile(file);
  };

  return (
    <div className="space-y-5">
      <TextField
        id="gallery-title"
        label="TITLE"
        value={form.values.title}
        error={form.errors.title}
        onChange={(value) => form.setField("title", value)}
      />
      <TextField
        id="gallery-link"
        label="LINK"
        value={form.values.link}
        error={form.errors.link}
        inputMode="url"
        onChange={(value) => form.setField("link", value)}
      />
      <div>
        <label
          htmlFor="gallery-category"
          className="mb-2 block text-2xl font-medium text-black"
        >
          DEPARTMENT
        </label>
        <div className="group relative">
          <select
            id="gallery-category"
            value={form.values.category}
            onChange={(event) =>
              form.setField("category", event.target.value as GaleriDepartment)
            }
            className="h-12 w-full appearance-none border border-[#C8C8C8] bg-transparent px-3 pr-12 text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {departments.map((option) => (
              <option key={option} value={option}>
                {option.replaceAll("_", " ").toUpperCase()}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black transition-transform duration-300 group-focus-within:rotate-180"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="gallery-date"
          className="mb-2 block text-2xl font-medium text-black"
        >
          DATE
        </label>
        <input
          id="gallery-date"
          type="date"
          value={form.values.takenAt}
          aria-invalid={Boolean(form.errors.takenAt)}
          onChange={(event) => form.setField("takenAt", event.target.value)}
          className="h-12 w-full max-w-[260px] border border-[#C8C8C8] bg-transparent px-3 text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        />
        <FieldError message={form.errors.takenAt} />
      </div>
      <div>
        <span className="mb-2 block text-2xl font-medium text-black">
          COVER IMAGE
        </span>
        <label className="flex min-h-44 w-full cursor-pointer flex-col items-center justify-center border border-[#C8C8C8] text-black/70 focus-within:ring-2 focus-within:ring-blue-600">
          <Upload aria-hidden size={28} />
          <span className="mt-2 text-sm">Click to upload or drag and drop</span>
          <span className="mt-1 text-xs text-black/55">
            PNG/JPG/JPEG max 5MB
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Upload gambar galeri"
            onChange={(event) => {
              chooseImage(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        {form.imageFile || form.values.imageUrl ? (
          <div className="mt-3 w-40 overflow-hidden border border-[#C8C8C8] bg-white">
            <img
              src={form.imageFile ? form.previewUrl : form.values.imageUrl}
              alt={
                form.imageFile
                  ? "Gallery image preview"
                  : "Current gallery image"
              }
              className="aspect-[16/9] h-auto w-full object-cover"
            />
          </div>
        ) : null}
        <FieldError message={form.errors.imageUrl} />
      </div>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  error,
  inputMode,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  inputMode?: "url";
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-2xl font-medium text-black"
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full border border-[#C8C8C8] bg-transparent px-4 text-base text-black outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      />
      <FieldError message={error} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="mt-1 text-sm text-red-700">
      {message}
    </p>
  ) : null;
}
