"use client";

import { useEffect, useMemo, useState } from "react";

import { BlogFormValues, validateBlogForm } from "../schemas/blogFormSchema";

export function useBlogForm(initialValues?: BlogFormValues) {
  const [values, setValues] = useState<BlogFormValues>(
    initialValues ?? {
      title: "",
      category: "FTEIC",
      content: "",
      coverImage: "",
      status: "PUBLISHED",
    },
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState("");
  const errors = useMemo(
    () => validateBlogForm(values, Boolean(coverFile)),
    [values, coverFile],
  );

  useEffect(() => {
    if (!coverFile) {
      setCroppedPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCroppedPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const setField = <K extends keyof BlogFormValues>(
    key: K,
    value: BlogFormValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  return {
    values,
    errors,
    isValid: Object.keys(errors).length === 0,
    setField,
    coverFile,
    setCoverFile,
    pendingCropFile,
    setPendingCropFile,
    croppedPreviewUrl,
  };
}
