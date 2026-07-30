"use client";

import { ChevronDown, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { BlogStatus } from "@/features/blog/types";
import { useBlogForm } from "@/features/dashboard/hooks/useBlogForm";
import { EVENT_DEPARTMENTS } from "@/features/event/department";

const departments = EVENT_DEPARTMENTS.map((item) => item.category);

export function BlogFormFields({
  form,
}: {
  form: ReturnType<typeof useBlogForm>;
}) {
  const chooseCover = (file?: File) => {
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
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="md:col-span-3">
          <label
            htmlFor="blog-title"
            className="mb-2 block text-2xl font-medium text-black"
          >
            TITLE
          </label>
          <input
            id="blog-title"
            value={form.values.title}
            onChange={(event) => form.setField("title", event.target.value)}
            placeholder="Enter blog title"
            aria-invalid={Boolean(form.errors.title)}
            aria-describedby={
              form.errors.title ? "blog-title-error" : undefined
            }
            className="h-16 w-full border border-[#C8C8C8] bg-transparent px-4 text-lg text-black placeholder:text-black/55 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          />
          {form.errors.title ? (
            <p
              id="blog-title-error"
              role="alert"
              className="mt-1 text-sm text-red-700"
            >
              {form.errors.title}
            </p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <span className="mb-2 block text-2xl font-medium text-black">
            COVER IMAGE
          </span>
          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center border border-[#C8C8C8] text-black/70 focus-within:ring-2 focus-within:ring-blue-600">
            <Upload aria-hidden size={28} />
            <span className="mt-2 text-sm">Click to upload</span>
            <span className="mt-1 text-xs text-black/55">
              PNG/JPG/JPEG max 5MB
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Upload cover blog"
              onChange={(event) => {
                chooseCover(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          {form.coverFile || form.values.coverImage ? (
            <div className="mt-3">
              <div className="w-40 overflow-hidden border border-[#C8C8C8] bg-white">
                <img
                  src={
                    form.coverFile
                      ? form.croppedPreviewUrl
                      : form.values.coverImage
                  }
                  alt={
                    form.coverFile
                      ? "Cropped blog cover preview"
                      : "Current blog cover"
                  }
                  className="aspect-[16/9] h-auto w-full object-cover"
                />
              </div>
              <p className="mt-2 line-clamp-1 text-xs text-black/70">
                {form.coverFile?.name || `Current: ${form.values.coverImage}`}
              </p>
            </div>
          ) : null}
          {form.errors.coverImage ? (
            <p role="alert" className="mt-1 text-sm text-red-700">
              {form.errors.coverImage}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <SelectField
          id="blog-category"
          label="DEPARTMENT"
          value={form.values.category}
          options={departments}
          onChange={(value) => form.setField("category", value)}
        />
        <SelectField
          id="blog-status"
          label="STATUS"
          value={form.values.status}
          options={["DRAFT", "PUBLISHED", "ARCHIVED"]}
          onChange={(value) => form.setField("status", value as BlogStatus)}
        />
      </div>
    </>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
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
      <div className="group relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none border border-[#C8C8C8] bg-transparent px-3 pr-12 text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black transition-transform duration-300 ease-out group-focus-within:rotate-180"
        />
      </div>
    </div>
  );
}
