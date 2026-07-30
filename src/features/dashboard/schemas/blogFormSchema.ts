import { BlogStatus } from "@/features/blog/types";

export interface BlogFormValues {
  title: string;
  category: string;
  content: string;
  coverImage: string;
  status: BlogStatus;
}

export type BlogFormErrors = Partial<Record<keyof BlogFormValues, string>>;

export function validateBlogForm(
  values: BlogFormValues,
  hasCoverFile: boolean,
): BlogFormErrors {
  const errors: BlogFormErrors = {};
  if (!values.title.trim()) errors.title = "Judul blog wajib diisi.";
  if (!values.category.trim()) errors.category = "Departemen wajib dipilih.";
  if (!values.content.trim()) errors.content = "Konten blog wajib diisi.";
  if (!values.coverImage.trim() && !hasCoverFile) {
    errors.coverImage = "Cover blog wajib dipilih.";
  }
  if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(values.status)) {
    errors.status = "Status blog tidak valid.";
  }
  return errors;
}
