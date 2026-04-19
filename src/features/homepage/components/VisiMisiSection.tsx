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
      <div className="mx-auto max-w-6xl space-y-16 px-6">
        <ScrollReveal delay={40}>
          <div className="text-center">
            <h3 className="text-4xl font-extrabold text-black md:text-5xl">
              VISI
            </h3>
            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-black/90 md:text-2xl">
              Mewujudkan BEM FTEIC yang adaptif dan harmonis sebagai elevator
              pengembangan kapasitas mahasiswa FTEIC serta berperan komprehensif
              dalam masyarakat.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={90}>
          <div className="text-center">
            <h3 className="text-4xl font-extrabold text-black md:text-5xl">
              MISI
            </h3>
            <div className="mx-auto mt-6 max-w-[56rem] space-y-4 text-center text-lg leading-relaxed text-black/90 md:text-2xl">
              {missionItems.map((item, index) => (
                <p key={item}>
                  <span className="mr-2 font-semibold">{index + 1}.</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
