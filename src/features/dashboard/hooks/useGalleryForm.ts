"use client";

import { useEffect, useMemo, useState } from "react";

import {
  GalleryFormValues,
  validateGalleryForm,
} from "../schemas/galleryFormSchema";

export function useGalleryForm(initialValues?: GalleryFormValues) {
  const [values, setValues] = useState<GalleryFormValues>(
    initialValues
      ? { ...initialValues, takenAt: initialValues.takenAt.slice(0, 10) }
      : {
          title: "",
          link: "",
          takenAt: "",
          imageUrl: "",
          category: "all",
        },
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const errors = useMemo(
    () => validateGalleryForm(values, Boolean(imageFile)),
    [values, imageFile],
  );

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const setField = <K extends keyof GalleryFormValues>(
    key: K,
    value: GalleryFormValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  return {
    values,
    errors,
    isValid: Object.keys(errors).length === 0,
    setField,
    imageFile,
    setImageFile,
    pendingCropFile,
    setPendingCropFile,
    previewUrl,
  };
}
