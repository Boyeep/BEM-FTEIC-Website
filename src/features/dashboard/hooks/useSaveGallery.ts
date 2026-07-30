"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { User } from "@/features/auth/types";
import { galeriService } from "@/features/galeri/services/galeriService";
import { queryKeys } from "@/lib/queryKeys";

import { GalleryFormValues } from "../schemas/galleryFormSchema";

interface SaveGalleryInput {
  mode: "create" | "edit";
  galleryId?: string;
  values: GalleryFormValues;
  imageFile: File | null;
  user: User;
}

export function useSaveGallery() {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async ({
      mode,
      galleryId,
      values,
      imageFile,
      user,
    }: SaveGalleryInput) => {
      const imageUrl = imageFile
        ? await galeriService.uploadImage(user.id, imageFile)
        : values.imageUrl;
      const payload = { ...values, imageUrl };
      if (mode === "create") {
        return galeriService.createGaleri(payload, user.id);
      }
      if (!galleryId) throw new Error("Missing gallery id.");
      return galeriService.updateGaleri(galleryId, payload);
    },
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.gallery.all }),
        client.invalidateQueries({ queryKey: queryKeys.gallery.admin.all }),
      ]);
      router.push("/dashboard/galeri/overview");
      router.refresh();
    },
  });
}
