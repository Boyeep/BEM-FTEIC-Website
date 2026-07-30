"use client";

import { useEffect, useMemo, useState } from "react";

import { EventFormValues, validateEventForm } from "../schemas/eventFormSchema";

export function useEventForm(initialValues?: EventFormValues) {
  const [values, setValues] = useState<EventFormValues>(
    initialValues
      ? { ...initialValues, eventDate: initialValues.eventDate.slice(0, 10) }
      : {
          title: "",
          category: "FTEIC",
          description: "",
          coverImage: "",
          eventDate: "",
          status: "ONGOING",
          publicationStatus: "PUBLISHED",
        },
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const errors = useMemo(
    () => validateEventForm(values, Boolean(coverFile)),
    [values, coverFile],
  );

  useEffect(() => {
    if (!coverFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const setField = <K extends keyof EventFormValues>(
    key: K,
    value: EventFormValues[K],
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
    previewUrl,
  };
}
