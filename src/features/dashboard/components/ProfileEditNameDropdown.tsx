"use client";

import { ArrowLeft } from "lucide-react";

type ProfileEditNameDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
};

export default function ProfileEditNameDropdown({
  value,
  onChange,
  onBack,
  onSave,
  isSaving,
}: ProfileEditNameDropdownProps) {
  return (
    <div className="w-[320px] border-b-2 border-[#365BD7] bg-[#D9D9D9] p-5 shadow-[0_10px_20px_rgba(0,0,0,0.22)]">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-[#365BD7]"
      >
        <ArrowLeft className="h-5 w-5" />
        KEMBALI
      </button>

      <h3 className="mb-4 text-center text-3xl font-semibold leading-tight text-[#2B53D3]">
        Masukkan
        <br />
        Nama Baru
      </h3>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mb-3 h-12 w-full bg-[#CFCFD1] px-4 text-center text-xl text-black outline-none"
      />

      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="h-11 w-full bg-[#E1B454] text-xl font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-75"
      >
        {isSaving ? "Menyimpan..." : "Simpan nama"}
      </button>
    </div>
  );
}
