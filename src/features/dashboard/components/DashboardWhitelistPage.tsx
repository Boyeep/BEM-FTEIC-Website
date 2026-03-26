"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { signupWhitelistService } from "@/features/auth/services/signupWhitelistService";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import DeleteConfirmModal from "@/features/dashboard/components/DeleteConfirmModal";

export default function DashboardWhitelistPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<{
    id: string;
    email: string;
  } | null>(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["signup-whitelist"],
    queryFn: () => signupWhitelistService.getEntries(),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;
    if (!user) {
      toast.error("Kamu harus login terlebih dahulu.");
      return;
    }

    const normalizedEmail = signupWhitelistService.normalizeEmail(email);
    if (!signupWhitelistService.isValidEmail(normalizedEmail)) {
      toast.error("Masukkan email yang valid.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signupWhitelistService.addEntry(normalizedEmail, user.id);
      setEmail("");
      await queryClient.invalidateQueries({ queryKey: ["signup-whitelist"] });
      toast.success("Email berhasil ditambahkan ke whitelist.");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Gagal menambahkan email ke whitelist.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await signupWhitelistService.removeEntry(selectedDelete.id);
      await queryClient.invalidateQueries({ queryKey: ["signup-whitelist"] });
      toast.success("Email berhasil dihapus dari whitelist.");
      setSelectedDelete(null);
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus email dari whitelist.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-[1280px] space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-extrabold uppercase text-black md:text-5xl">
            AUTH WHITELIST
          </h1>
          <p className="max-w-3xl text-sm text-black/70 md:text-base">
            Hanya email yang ada di daftar ini yang bisa signup dan login ke
            dashboard.
          </p>
        </header>

        <section className="border border-[#D0D0D0] bg-white p-5 md:p-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 md:flex-row md:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="whitelist-email"
                className="mb-2 block text-sm font-semibold uppercase text-black"
              >
                Email
              </label>
              <input
                id="whitelist-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@example.com"
                className="h-12 w-full border border-[#C8C8C8] bg-transparent px-4 text-sm text-black outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 bg-[#2563EB] px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Menyimpan..." : "+ Tambah Email"}
            </button>
          </form>
        </section>

        <section className="overflow-hidden border border-[#D0D0D0] bg-white">
          <div className="flex items-center justify-between border-b border-[#D0D0D0] px-5 py-4">
            <h2 className="text-xl font-bold uppercase text-black">
              Daftar Whitelist
            </h2>
            <span className="text-sm text-black/60">
              {data?.length || 0} email
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed">
              <thead className="bg-black">
                <tr>
                  <th className="w-[52%] px-4 py-3 text-left text-xs font-medium uppercase text-white">
                    Email
                  </th>
                  <th className="w-[28%] px-4 py-3 text-left text-xs font-medium uppercase text-white">
                    Ditambahkan
                  </th>
                  <th className="w-[20%] px-4 py-3 text-left text-xs font-medium uppercase text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-sm text-black/70">
                      Memuat whitelist...
                    </td>
                  </tr>
                ) : null}

                {isError ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-sm text-red-600">
                      {error.message}
                    </td>
                  </tr>
                ) : null}

                {!isPending && !isError && data?.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-sm text-black/70">
                      Belum ada email yang di-whitelist.
                    </td>
                  </tr>
                ) : null}

                {data?.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#E5E7EB]">
                    <td className="px-4 py-3 text-sm text-black">
                      <span className="block truncate">{entry.email}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-black/70">
                      {new Date(entry.createdAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDelete({
                            id: entry.id,
                            email: entry.email,
                          })
                        }
                        className="inline-flex items-center gap-2 text-sm text-red-600 transition-colors hover:text-red-700"
                      >
                        <Trash2 size={14} />
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <DeleteConfirmModal
        isOpen={Boolean(selectedDelete)}
        isLoading={isDeleting}
        title="HAPUS EMAIL?"
        message={`Email ${selectedDelete?.email || ""} akan dikeluarkan dari whitelist.`}
        confirmLabel="Hapus Email"
        onCancel={() => {
          if (isDeleting) return;
          setSelectedDelete(null);
        }}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </main>
  );
}
