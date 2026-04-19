import Image from "next/image";

import ScrollReveal from "@/components/ScrollReveal";

export default function AboutSection() {
  return (
    <section className="bg-black pb-24 pt-6 md:pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
        <ScrollReveal delay={40}>
          <div className="group relative h-[280px] w-full overflow-hidden md:h-[360px]">
            <Image
              src="/images/Homepage-About-Image.JPG"
              alt="Homepage about"
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:rotate-[0.8deg]"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={90}>
          <div className="text-white">
            <h2 className="text-4xl font-extrabold md:text-5xl text-center mb-12">
              Mars FTEIC ITS
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Electics
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Bersatu dalam perbedaan
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Bersama menggapai tuju
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Pegang teguh integritas
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Gaungkan suara perubahan
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Bersama, membangun, solidaritas
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Electics, Electics
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Jiwa raga ku korbankan
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Jatuh bangkit Bersama
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Cahaya Emasku
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Arahkan Pijakmu
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Halaui Rintangan
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl text-center italic">
              Jayalah Electicsku
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
