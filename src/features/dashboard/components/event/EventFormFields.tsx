"use client";

import { ChevronDown, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { useEventForm } from "@/features/dashboard/hooks/useEventForm";
import { EVENT_DEPARTMENTS } from "@/features/event/department";
import { EventStatus, PublicationStatus } from "@/features/event/types";

const departments = EVENT_DEPARTMENTS.map((item) => item.category);

export function EventFormFields({
  form,
}: {
  form: ReturnType<typeof useEventForm>;
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
        <TextField
          id="event-title"
          label="TITLE"
          value={form.values.title}
          error={form.errors.title}
          className="md:col-span-3"
          onChange={(value) => form.setField("title", value)}
        />
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
              aria-label="Upload cover event"
              onChange={(event) => {
                chooseCover(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          {form.coverFile || form.values.coverImage ? (
            <div className="mt-3 w-40 overflow-hidden border border-[#C8C8C8] bg-white">
              <img
                src={form.coverFile ? form.previewUrl : form.values.coverImage}
                alt={
                  form.coverFile ? "Event cover preview" : "Current event cover"
                }
                className="aspect-[16/9] h-auto w-full object-cover"
              />
            </div>
          ) : null}
          <FieldError message={form.errors.coverImage} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <SelectField
          id="event-category"
          label="DEPARTMENT"
          value={form.values.category}
          options={departments}
          onChange={(value) => form.setField("category", value)}
        />
        <div>
          <label
            htmlFor="event-date"
            className="mb-2 block text-2xl font-medium text-black"
          >
            DATE
          </label>
          <input
            id="event-date"
            type="date"
            value={form.values.eventDate}
            aria-invalid={Boolean(form.errors.eventDate)}
            onChange={(event) => form.setField("eventDate", event.target.value)}
            className="h-12 w-full border border-[#C8C8C8] bg-transparent px-3 text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          />
          <FieldError message={form.errors.eventDate} />
        </div>
        <SelectField
          id="event-status"
          label="STATUS"
          value={form.values.status}
          options={["UPCOMING", "ONGOING", "ENDED"]}
          onChange={(value) => form.setField("status", value as EventStatus)}
        />
        <SelectField
          id="event-publication"
          label="PUBLICATION"
          value={form.values.publicationStatus}
          options={["DRAFT", "PUBLISHED", "ARCHIVED"]}
          onChange={(value) =>
            form.setField("publicationStatus", value as PublicationStatus)
          }
        />
      </div>
    </>
  );
}

function TextField({
  id,
  label,
  value,
  error,
  className,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  className?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-2xl font-medium text-black"
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className="h-16 w-full border border-[#C8C8C8] bg-transparent px-4 text-lg text-black outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      />
      <FieldError message={error} />
    </div>
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
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black transition-transform duration-300 group-focus-within:rotate-180"
        />
      </div>
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
