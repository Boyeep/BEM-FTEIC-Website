import { EventStatus, PublicationStatus } from "@/features/event/types";

export interface EventFormValues {
  title: string;
  category: string;
  description: string;
  coverImage: string;
  eventDate: string;
  status: EventStatus;
  publicationStatus: PublicationStatus;
}

export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>;

export function validateEventForm(
  values: EventFormValues,
  hasCoverFile: boolean,
): EventFormErrors {
  const errors: EventFormErrors = {};
  if (!values.title.trim()) errors.title = "Judul event wajib diisi.";
  if (!values.category.trim()) errors.category = "Departemen wajib dipilih.";
  if (!values.description.trim()) {
    errors.description = "Deskripsi event wajib diisi.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.eventDate)) {
    errors.eventDate = "Tanggal event wajib diisi.";
  }
  if (!values.coverImage.trim() && !hasCoverFile) {
    errors.coverImage = "Cover event wajib dipilih.";
  }
  if (!["UPCOMING", "ONGOING", "ENDED"].includes(values.status)) {
    errors.status = "Lifecycle event tidak valid.";
  }
  if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(values.publicationStatus)) {
    errors.publicationStatus = "Status publikasi tidak valid.";
  }
  return errors;
}
