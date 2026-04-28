import ScrollReveal from "@/components/ScrollReveal";

const missionItems = [
  "Mengoptimalkan sistem serta budaya kerja BEM FTEIC yang adaptif, profesional, dan humanis sebagai fondasi organisasi yang responsif terhadap dinamika zaman.",
  "Memperkuat sinergi kelembagaan dan memperluas jejaring strategis BEM FTEIC baik di tingkat internal maupun eksternal.",
  "Mengembangkan kapasitas, ruang aktualisasi, dan nilai keilmuan mahasiswa FTEIC secara berkelanjutan.",
  "Menjaga citra kelembagaan, mendorong kemandirian organisasi, serta menguatkan peran sosial BEM FTEIC yang berdampak nyata.",
];

export default function VisiMisiSection() {
  return (
    <section className="bg-[#F3F3F3] py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2">
        <ScrollReveal delay={40}>
          <div>
            <h3 className="text-4xl font-extrabold text-black md:text-5xl">
              VISI
            </h3>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/90 md:text-2xl">
              Mewujudkan BEM FTEIC yang adaptif dan harmonis sebagai elevator
              pengembangan kapasitas mahasiswa FTEIC serta berperan komprehensif
              dalam masyarakat.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={90}>
          <div>
            <h3 className="text-4xl font-extrabold text-black md:text-5xl">
              MISI
            </h3>
            <ul className="mt-6 list-disc space-y-2 pl-7 text-lg leading-relaxed text-black/90 md:text-2xl">
              {missionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
