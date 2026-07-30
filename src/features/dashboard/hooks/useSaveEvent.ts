"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { User } from "@/features/auth/types";
import { eventService } from "@/features/event/services/eventService";
import { queryKeys } from "@/lib/queryKeys";

import { EventFormValues } from "../schemas/eventFormSchema";

interface SaveEventInput {
  mode: "create" | "edit";
  eventId?: string;
  values: EventFormValues;
  coverFile: File | null;
  user: User;
}

export function useSaveEvent() {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async ({
      mode,
      eventId,
      values,
      coverFile,
      user,
    }: SaveEventInput) => {
      const coverImage = coverFile
        ? await eventService.uploadCover(user.id, coverFile)
        : values.coverImage;
      const payload = { ...values, coverImage };
      if (mode === "create") {
        return eventService.createEvent(
          payload,
          user.username || user.email,
          user.id,
        );
      }
      if (!eventId) throw new Error("Missing event id.");
      return eventService.updateEvent(eventId, payload);
    },
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.events.all }),
        client.invalidateQueries({ queryKey: queryKeys.events.admin.all }),
      ]);
      router.push("/dashboard/event/overview");
      router.refresh();
    },
  });
}
