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
  { href: "/dashboard/galeri/overview", label: "GALERI" },
];

export default function DashboardNavbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<"menu" | "edit-name">("menu");
  const [editedName, setEditedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const { user, setUser } = useAuthStore();

  const displayName = user?.username?.trim() || "NAMA AKUN";
  const displayEmail = user?.email?.trim() || "-";
  const displayAvatarUrl = user?.avatarUrl || null;

  useEffect(() => {
    if (!isPopupOpen && !isMobileNavOpen) return;

    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popupRef.current?.contains(target)) return;
      if (mobileNavRef.current?.contains(target)) return;
      if (mobileMenuButtonRef.current?.contains(target)) return;
      if (profileButtonRef.current?.contains(target)) return;

      setIsPopupOpen(false);
      setPopupMode("menu");
      setIsMobileNavOpen(false);
    };

    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [isPopupOpen, isMobileNavOpen]);

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
        <div className="flex items-center gap-7">
          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center text-black md:hidden"
            aria-label="Toggle dashboard navigation menu"
            aria-expanded={isMobileNavOpen}
          >
            <span className="relative block h-5 w-6">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 bg-black transition-transform duration-200 ${
                  isMobileNavOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-6 bg-black transition-opacity duration-200 ${
                  isMobileNavOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-6 bg-black transition-transform duration-200 ${
                  isMobileNavOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-[14px] font-normal text-black md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:opacity-75"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          ref={profileButtonRef}
          type="button"
          onClick={() => {
            setEditedName(displayName);
            setPopupMode("menu");
            setIsMobileNavOpen(false);
            setIsPopupOpen((prev) => !prev);
          }}
          className="flex items-center gap-4 text-black"
          aria-label="Open profile popup"
        >
          <span className="hidden text-[14px] uppercase md:block">
            {displayName}
          </span>
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

      {isMobileNavOpen ? (
        <div
          ref={mobileNavRef}
          className="absolute left-4 top-[56px] w-[220px] border-b-2 border-[#365BD7] bg-[#D9D9D9] p-2 shadow-[0_10px_20px_rgba(0,0,0,0.22)] md:hidden"
        >
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 text-[14px] font-semibold text-black hover:bg-[#ECECEC]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

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
