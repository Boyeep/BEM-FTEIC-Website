"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { profileService } from "@/features/auth/services/profileService";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { supabase } from "@/lib/supabase";

export function useDashboardProfile() {
  const router = useRouter();
  const { user, setUser, logout: clearAuthState } = useAuthStore();
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);

  const logout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut({ scope: "local" });
    } finally {
      clearAuthState();
      toast.success("Logout berhasil.");
      router.replace("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const saveName = async (rawName: string) => {
    const username = rawName.trim();
    if (!username || !user) throw new Error("Nama tidak boleh kosong.");
    setIsSavingName(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username },
      });
      if (error) throw new Error(error.message || "Gagal mengubah nama akun.");
      const profile = await profileService.updateName(user.id, username);
      setUser({
        ...user,
        email: profile.email || user.email,
        username: profile.username,
      });
    } finally {
      setIsSavingName(false);
    }
  };

  const saveAvatar = async (file: File) => {
    if (!user) return;
    setIsUploadingPhoto(true);
    try {
      const profile = await profileService.uploadAvatar(user.id, file);
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: profile.avatar_url },
      });
      if (error) {
        throw new Error(error.message || "Gagal menyinkronkan foto profil.");
      }
      setUser({
        ...user,
        email: profile.email || user.email,
        username: profile.username || user.username,
        avatarUrl: profile.avatar_url || null,
      });
      setPendingAvatarFile(null);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const selectAvatar = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5MB.");
      return;
    }
    setPendingAvatarFile(file);
  };

  return {
    user,
    displayName: user?.username?.trim() || "NAMA AKUN",
    displayEmail: user?.email?.trim() || "-",
    displayAvatarUrl: user?.avatarUrl || null,
    isSavingName,
    isUploadingPhoto,
    isLoggingOut,
    pendingAvatarFile,
    setPendingAvatarFile,
    selectAvatar,
    saveName,
    saveAvatar,
    logout,
  };
}
