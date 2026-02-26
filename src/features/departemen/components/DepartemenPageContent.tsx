import DepartemenCardGrid from "@/features/departemen/components/DepartemenCardGrid";
import DepartemenFilters from "@/features/departemen/components/DepartemenFilters";
import DepartemenHeader from "@/features/departemen/components/DepartemenHeader";
import DepartemenPagination from "@/features/departemen/components/DepartemenPagination";

export default function DepartemenPageContent() {
  return (
    <main className="min-h-screen bg-[#F3F3F3] px-6 py-16">
      <section className="mx-auto w-full max-w-6xl">
        <DepartemenHeader />
        <DepartemenFilters />
        <DepartemenCardGrid />
        <DepartemenPagination />
      </section>
    </main>
  );
}
