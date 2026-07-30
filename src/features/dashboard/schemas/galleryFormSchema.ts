import { GaleriDepartment } from "@/features/galeri/types";

export interface GalleryFormValues {
  title: string;
  link: string;
  takenAt: string;
  imageUrl: string;
  category: GaleriDepartment;
}

export type GalleryFormErrors = Partial<
  Record<keyof GalleryFormValues, string>
>;

export function validateGalleryForm(
  values: GalleryFormValues,
  hasImageFile: boolean,
): GalleryFormErrors {
  const errors: GalleryFormErrors = {};
  if (!values.title.trim()) errors.title = "Judul galeri wajib diisi.";
  try {
    new URL(values.link);
  } catch {
    errors.link = "Link galeri harus berupa URL yang valid.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.takenAt)) {
    errors.takenAt = "Tanggal galeri wajib diisi.";
  }
  if (!values.imageUrl.trim() && !hasImageFile) {
    errors.imageUrl = "Gambar galeri wajib dipilih.";
  }
  return errors;
}
