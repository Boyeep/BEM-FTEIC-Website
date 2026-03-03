"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { profileService } from "@/features/auth/services/profileService";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import ProfileDropdown from "@/features/dashboard/components/ProfileDropdown";
import ProfileEditNameDropdown from "@/features/dashboard/components/ProfileEditNameDropdown";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/dashboard/blog/overview", label: "BLOG" },
  { href: "/dashboard/event/overview", label: "EVENT" },
  { href: "/galeri", label: "GALERI" },
];

export default function DashboardNavbar() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<"menu" | "edit-name">("menu");
  const [editedName, setEditedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const { user, setUser } = useAuthStore();

  const displayName = user?.username?.trim() || "NAMA AKUN";
  const displayEmail = user?.email?.trim() || "-";
  const displayAvatarUrl = user?.avatarUrl || null;

  useEffect(() => {
    const syncUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return;
      let profile = null;
      try {
        profile = await profileService.ensureForUser(data.user);
      } catch {
        profile = null;
      }
      setUser({
        id: data.user.id,
        email: profile?.email || data.user.email || "",
        username:
          profile?.username ||
          (typeof data.user.user_metadata?.username === "string"
            ? data.user.user_metadata.username
            : data.user.email || ""),
        avatarUrl:
          profile?.avatar_url ||
          (typeof data.user.user_metadata?.avatar_url === "string"
            ? data.user.user_metadata.avatar_url
            : null),
        createdAt: data.user.created_at,
      });
    };

    void syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) return;
      let profile = null;
      try {
        profile = await profileService.ensureForUser(session.user);
      } catch {
        profile = null;
      }
      setUser({
        id: session.user.id,
        email: profile?.email || session.user.email || "",
        username:
          profile?.username ||
          (typeof session.user.user_metadata?.username === "string"
            ? session.user.user_metadata.username
            : session.user.email || ""),
        avatarUrl:
          profile?.avatar_url ||
          (typeof session.user.user_metadata?.avatar_url === "string"
            ? session.user.user_metadata.avatar_url
            : null),
        createdAt: session.user.created_at,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  useEffect(() => {
    if (!isPopupOpen) return;

    const onClickOutside = (event: MouseEvent) => {
      if (!popupRef.current) return;
      if (popupRef.current.contains(event.target as Node)) return;
      setIsPopupOpen(false);
      setPopupMode("menu");
    };

    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [isPopupOpen]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-[#FCD704]">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file || !user) return;

          if (!file.type.startsWith("image/")) {
            toast.error("File harus berupa gambar.");
            event.target.value = "";
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            toast.error("Ukuran gambar maksimal 5MB.");
            event.target.value = "";
            return;
          }

          setIsUploadingPhoto(true);
          try {
            const profile = await profileService.uploadAvatar(user.id, file);
            const { error: metadataError } = await supabase.auth.updateUser({
              data: { avatar_url: profile.avatar_url },
            });

            if (metadataError) {
              throw new Error(
                metadataError.message || "Gagal menyinkronkan foto profil.",
              );
            }

            setUser({
              ...user,
              email: profile.email || user.email,
              username: profile.username || user.username,
              avatarUrl: profile.avatar_url || null,
            });
            toast.success("Foto profil berhasil diubah.");
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Gagal mengubah foto profil.";
            toast.error(message);
          } finally {
            setIsUploadingPhoto(false);
            event.target.value = "";
          }
        }}
      />
      <div className="mx-auto flex h-[56px] w-full max-w-[1600px] items-center justify-between px-4 md:px-8">
        <nav className="flex items-center gap-7 text-[14px] font-normal text-black">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:opacity-75">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => {
            setEditedName(displayName);
            setPopupMode("menu");
            setIsPopupOpen((prev) => !prev);
          }}
          className="flex items-center gap-4 text-black"
          aria-label="Open profile popup"
        >
          <span className="text-[14px] uppercase">{displayName}</span>
          {displayAvatarUrl ? (
            <img
              src={displayAvatarUrl}
              alt="Profile avatar"
              className="h-8 w-8 object-cover"
            />
          ) : (
            <span className="block h-8 w-8 bg-black" />
          )}
        </button>
      </div>

      {isPopupOpen ? (
        <div
          ref={popupRef}
          className="absolute right-4 top-[56px] pt-2 md:right-8"
        >
          {popupMode === "menu" ? (
            <ProfileDropdown
              name={displayName}
              email={displayEmail}
              avatarUrl={displayAvatarUrl}
              onClose={() => {
                setIsPopupOpen(false);
                setPopupMode("menu");
              }}
              onEditName={() => setPopupMode("edit-name")}
              onEditPhoto={() => {
                if (isUploadingPhoto) return;
                photoInputRef.current?.click();
              }}
            />
          ) : (
            <ProfileEditNameDropdown
              value={editedName}
              onChange={setEditedName}
              onBack={() => setPopupMode("menu")}
              isSaving={isSavingName}
              onSave={async () => {
                const nextName = editedName.trim();
                if (!nextName) {
                  toast.error("Nama tidak boleh kosong.");
                  return;
                }

                setIsSavingName(true);
                try {
                  const { error } = await supabase.auth.updateUser({
                    data: { username: nextName },
                  });

                  if (error) {
                    throw new Error(
                      error.message || "Gagal mengubah nama akun.",
                    );
                  }

                  if (user) {
                    const profile = await profileService.updateName(
                      user.id,
                      nextName,
                    );
                    setUser({
                      ...user,
                      email: profile.email || user.email,
                      username: profile.username,
                    });
                  }

                  toast.success("Nama akun berhasil diubah.");
                  setPopupMode("menu");
                } catch (error) {
                  const message =
                    error instanceof Error
                      ? error.message
                      : "Gagal mengubah nama akun.";
                  toast.error(message);
                } finally {
                  setIsSavingName(false);
                }
              }}
            />
          )}
        </div>
      ) : null}
    </header>
  );
}
