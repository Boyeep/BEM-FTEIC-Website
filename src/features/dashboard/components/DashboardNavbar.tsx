"use client";

import { useRef, useState } from "react";

import { useDashboardProfile } from "@/features/dashboard/hooks/useDashboardProfile";

import { AvatarUploadDialog } from "./navigation/AvatarUploadDialog";
import { DashboardMobileNavigation } from "./navigation/DashboardMobileNavigation";
import { DashboardNavigation } from "./navigation/DashboardNavigation";
import { DashboardProfileMenu } from "./navigation/DashboardProfileMenu";

export default function DashboardNavbar() {
  const profile = useDashboardProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#FCD704]">
      <input
        ref={photoInput}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="Pilih foto profil"
        onChange={(event) => {
          profile.selectAvatar(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <div className="mx-auto flex h-[56px] w-full max-w-[1600px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-7">
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center text-black focus-visible:ring-2 focus-visible:ring-black md:hidden"
            aria-label="Toggle dashboard navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className="relative block h-5 w-6" aria-hidden>
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 bg-black transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-6 bg-black transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-6 bg-black transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
          <DashboardNavigation />
        </div>

        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            setProfileOpen((value) => !value);
          }}
          className="flex min-h-11 items-center gap-4 text-black focus-visible:ring-2 focus-visible:ring-black"
          aria-label="Buka menu profil"
          aria-expanded={profileOpen}
        >
          <span className="hidden text-[14px] uppercase md:block">
            {profile.displayName}
          </span>
          {profile.displayAvatarUrl ? (
            <img
              src={profile.displayAvatarUrl}
              alt=""
              className="h-8 w-8 object-cover"
            />
          ) : (
            <span aria-hidden className="block h-8 w-8 bg-black" />
          )}
        </button>
      </div>

      <DashboardMobileNavigation
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {profileOpen ? (
        <div className="absolute right-4 top-[56px] pt-2 md:right-8">
          <DashboardProfileMenu
            name={profile.displayName}
            email={profile.displayEmail}
            avatarUrl={profile.displayAvatarUrl}
            isLoggingOut={profile.isLoggingOut}
            isSavingName={profile.isSavingName}
            onClose={() => setProfileOpen(false)}
            onEditPhoto={() => photoInput.current?.click()}
            onLogout={() => void profile.logout()}
            onSaveName={profile.saveName}
          />
        </div>
      ) : null}

      <AvatarUploadDialog
        file={profile.pendingAvatarFile}
        onCancel={() => profile.setPendingAvatarFile(null)}
        onSave={profile.saveAvatar}
      />
    </header>
  );
}
