import toast from "react-hot-toast";

import ImageCropModal from "@/components/form/ImageCropModal";

export function AvatarUploadDialog({
  file,
  onCancel,
  onSave,
}: {
  file: File | null;
  onCancel: () => void;
  onSave: (file: File) => Promise<void>;
}) {
  return (
    <ImageCropModal
      isOpen={Boolean(file)}
      file={file}
      title="Sesuaikan Foto Profil"
      aspectRatio={1}
      cropShape="circle"
      targetWidth={800}
      targetHeight={800}
      onCancel={onCancel}
      onConfirm={async (croppedFile) => {
        try {
          await onSave(croppedFile);
          toast.success("Foto profil berhasil diubah.");
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Gagal mengubah foto profil.",
          );
        }
      }}
    />
  );
}
