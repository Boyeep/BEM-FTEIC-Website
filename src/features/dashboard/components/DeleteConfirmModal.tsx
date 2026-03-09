"use client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title = "PERHATIAN!",
  message = "Anda yakin ingin menghapus item ini?",
  confirmLabel = "Hapus Item",
  isLoading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-[780px] border-b-4 border-red-500 bg-white px-8 py-12 text-center">
        <div className="mx-auto mb-5 grid w-10 grid-cols-2 gap-2">
          <span className="h-3 w-3 bg-red-500" />
          <span className="h-3 w-3 bg-red-500" />
          <span className="h-3 w-3 bg-red-500" />
          <span className="h-3 w-3 bg-red-500" />
        </div>

        <h2 className="text-6xl font-extrabold uppercase text-red-500">
          {title}
        </h2>
        <p className="mt-4 text-3xl text-red-500">{message}</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            className="min-w-[160px] bg-[#3F3F3F] px-5 py-3 text-3xl font-medium text-white transition-colors hover:bg-[#2F2F2F]"
            onClick={onCancel}
            disabled={isLoading}
          >
            Kembali
          </button>
          <button
            type="button"
            className="min-w-[160px] bg-[#E33434] px-5 py-3 text-3xl font-medium text-white transition-colors hover:bg-[#CC2A2A] disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
