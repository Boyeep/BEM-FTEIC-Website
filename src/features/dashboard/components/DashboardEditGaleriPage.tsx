"use client";

import DashboardGaleriForm from "@/features/dashboard/components/DashboardGaleriForm";
import { useDashboardGaleriById } from "@/features/galeri/hooks/useDashboardGaleriById";

interface DashboardEditGaleriPageProps {
  id: string;
}

export default function DashboardEditGaleriPage({
  id,
}: DashboardEditGaleriPageProps) {
  const { data, isPending, isError, error } = useDashboardGaleriById(id);

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
        <p className="mx-auto max-w-[760px] text-sm text-black/70">
          Loading...
        </p>
      </main>
    );
  }

  if (isError || !data?.item) {
    return (
      <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
        <p className="mx-auto max-w-[760px] text-sm text-red-600">
          {error?.message || "Galeri item tidak ditemukan."}
        </p>
      </main>
    );
  }

  return (
    <DashboardGaleriForm
      mode="edit"
      galeriId={id}
      initialValues={{
        title: data.item.title,
        link: data.item.link,
        takenAt: data.item.takenAt,
        imageUrl: data.item.imageUrl,
      }}
    />
  );
}
