"use client";

import { ArrowLeft, LogOut, SquarePen } from "lucide-react";

type ProfileDropdownProps = {
  name: string;
  email: string;
  avatarUrl?: string | null;
  isLoggingOut?: boolean;
  onClose: () => void;
  onEditName: () => void;
  onEditPhoto: () => void;
  onLogout: () => void;
};

export default function ProfileDropdown({
  name,
  email,
  avatarUrl,
  isLoggingOut = false,
  onClose,
  onEditName,
  onEditPhoto,
  onLogout,
}: ProfileDropdownProps) {
  return (
    <div className="w-[320px] border-b-2 border-[#365BD7] bg-[#D9D9D9] p-5 shadow-[0_10px_20px_rgba(0,0,0,0.22)]">
      <button
        type="button"
        onClick={onClose}
        className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-[#365BD7]"
      >
        <ArrowLeft className="h-5 w-5" />
        KEMBALI
      </button>

      <div className="mb-4 flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile avatar"
            className="h-14 w-14 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center bg-gradient-to-b from-[#4A70E2] to-[#C4CDD9]">
            <div className="h-7 w-7 rounded-full bg-[#AFC0E7]" />
          </div>
        )}
        <div>
          <p className="text-[18px] font-semibold leading-none text-black">
            {name}
          </p>
          <p className="text-sm leading-tight text-[#4B4B4B]">{email}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onEditName}
        className="mb-2 flex w-full items-center gap-2 text-lg text-[#1B4FE0]"
      >
        <SquarePen className="h-5 w-5" />
        Edit nama akun
      </button>

      <button
        type="button"
        onClick={onEditPhoto}
        className="flex w-full items-center gap-2 text-lg text-[#1B4FE0]"
      >
        <SquarePen className="h-5 w-5" />
        Edit foto
      </button>

      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="mt-4 flex w-full items-center gap-2 border-t border-[#B8BBC3] pt-4 text-lg text-[#C42121] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <LogOut className="h-5 w-5" />
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
