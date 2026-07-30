"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { User } from "@/features/auth/types";
import { blogService } from "@/features/blog/services/blogService";
import { queryKeys } from "@/lib/queryKeys";

import { BlogFormValues } from "../schemas/blogFormSchema";

interface SaveBlogInput {
  mode: "create" | "edit";
  blogId?: string;
  values: BlogFormValues;
  coverFile: File | null;
  user: User;
}

export function useSaveBlog() {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async ({
      mode,
      blogId,
      values,
      coverFile,
      user,
    }: SaveBlogInput) => {
      const coverImage = coverFile
        ? await blogService.uploadCover(user.id, coverFile)
        : values.coverImage;
      const payload = { ...values, coverImage };
      if (mode === "create") {
        return blogService.createBlog(
          payload,
          user.username || user.email,
          user.id,
        );
      }
      if (!blogId) throw new Error("Missing blog id.");
      return blogService.updateBlog(blogId, payload);
    },
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.blogs.all }),
        client.invalidateQueries({ queryKey: queryKeys.blogs.admin.all }),
      ]);
      router.push("/dashboard/blog/overview");
      router.refresh();
    },
  });
}
