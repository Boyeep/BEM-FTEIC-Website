"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import ProfileDropdown from "../ProfileDropdown";
import ProfileEditNameDropdown from "../ProfileEditNameDropdown";

export function DashboardProfileMenu({
  name,
  email,
  avatarUrl,
  isLoggingOut,
  isSavingName,
  onClose,
  onEditPhoto,
  onLogout,
  onSaveName,
}: {
  name: string;
  email: string;
  avatarUrl: string | null;
  isLoggingOut: boolean;
  isSavingName: boolean;
  onClose: () => void;
  onEditPhoto: () => void;
  onLogout: () => void;
  onSaveName: (name: string) => Promise<void>;
}) {
  const [mode, setMode] = useState<"menu" | "edit-name">("menu");
  const [editedName, setEditedName] = useState(name);

  if (mode === "menu") {
    return (
      <ProfileDropdown
        name={name}
        email={email}
        avatarUrl={avatarUrl}
        isLoggingOut={isLoggingOut}
        onClose={onClose}
        onEditName={() => {
          setEditedName(name);
          setMode("edit-name");
        }}
        onEditPhoto={onEditPhoto}
        onLogout={onLogout}
      />
    );
  }

  return (
    <ProfileEditNameDropdown
      value={editedName}
      onChange={setEditedName}
      onBack={() => setMode("menu")}
      isSaving={isSavingName}
      onSave={() => {
        void onSaveName(editedName)
          .then(() => {
            toast.success("Nama akun berhasil diubah.");
            setMode("menu");
          })
          .catch((error) =>
            toast.error(
              error instanceof Error
                ? error.message
                : "Gagal mengubah nama akun.",
            ),
          );
      }}
    />
  );
}
