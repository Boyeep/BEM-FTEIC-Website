import ScrollReveal from "@/components/ScrollReveal";

export default function KabinetStrukturPageContent() {
  return (
    <main className="min-h-screen bg-[#F3F3F3] pt-0 md:pt-24">
      <ScrollReveal delay={40} className="md:hidden">
        <div className="h-[calc(100svh-64px)] overflow-x-auto overflow-y-hidden bg-[#F3F3F3] pt-10">
          <div className="h-full min-w-full aspect-[4096/2430]">
            <img
              src="/images/Kabinet_Struktur_Image.png"
              alt="Kabinet Struktur"
              className="h-full w-full object-contain object-center"
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={40} className="hidden md:block">
        <div className="md:flex md:h-[calc(100svh-96px)] md:items-center md:justify-center md:overflow-hidden md:bg-[#F3F3F3]">
          <img
            src="/images/Kabinet_Struktur_Image.png"
            alt="Kabinet Struktur"
            className="h-full w-full object-contain object-center"
          />
        </div>
      </ScrollReveal>
    </main>
  );
}
