import GaleriFilters from "@/features/galeri/components/GaleriFilters";
import GaleriGrid from "@/features/galeri/components/GaleriGrid";
import GaleriPagination from "@/features/galeri/components/GaleriPagination";

export default function GaleriPageContent() {
  return (
    <main className="min-h-screen bg-[#F3F3F3] px-6 py-16">
      <section className="mx-auto w-full max-w-6xl">
        <GaleriFilters />
        <GaleriGrid />
        <GaleriPagination />
      </section>
    </main>
  );
}
