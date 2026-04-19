import Image from "next/image";

import ScrollReveal from "@/components/ScrollReveal";

const marsLyrics = [
  "Electics",
  "Bersatu dalam perbedaan",
  "Bersama menggapai tuju",
  "Pegang teguh integritas",
  "Gaungkan suara perubahan",
  "Bersama, membangun, solidaritas",
  "Electics, Electics",
  "Jiwa raga ku korbankan",
  "Jatuh bangkit Bersama",
  "Cahaya Emasku",
  "Arahkan Pijakmu",
  "Halaui Rintangan",
  "Jayalah Electicsku",
];

export default function AboutSection() {
  return (
    <section className="bg-black pb-24 pt-6 md:pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-2 md:items-center">
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
          <div className="flex h-[280px] flex-col text-white md:h-[360px]">
            <h2 className="mb-8 text-center text-4xl font-extrabold md:text-5xl">
              <span>Mars </span>
              <span className="text-[#FCD704]">FTEIC</span>
              <span> ITS</span>
            </h2>
            <div className="scrollbar-gold flex-1 overflow-y-scroll pr-3">
              {marsLyrics.map((line) => (
                <p
                  key={line}
                  className="mt-6 text-center text-lg italic leading-relaxed text-white/90 first:mt-0 md:text-2xl"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
