import Link from "next/link";

const departments = [
  {
    name: "Teknik Elektro",
    description: "Ut vel tortor quis enim facilisis tempus nec ornare dolor.",
    href: "https://www.its.ac.id/telektro/id/departemen-teknik-elektro-its/",
  },
  {
    name: "Teknik Informatika",
    description: "Ut vel tortor quis enim facilisis tempus nec ornare dolor.",
    href: "https://www.its.ac.id/informatika/id/departemen-teknik-informatika/",
  },
  {
    name: "Sistem Informasi",
    description: "Ut vel tortor quis enim facilisis tempus nec ornare dolor.",
    href: "https://www.its.ac.id/si/",
  },
  {
    name: "Teknik Komputer",
    description: "Ut vel tortor quis enim facilisis tempus nec ornare dolor.",
    href: "https://www.its.ac.id/komputer/id/departemen-teknik-komputer-its/",
  },
  {
    name: "Teknik Biomedik",
    description: "Ut vel tortor quis enim facilisis tempus nec ornare dolor.",
    href: "https://www.its.ac.id/tbiomedik/id/beranda/",
  },
  {
    name: "Teknologi Informasi",
    description: "Ut vel tortor quis enim facilisis tempus nec ornare dolor.",
    href: "https://www.its.ac.id/it/id/departemen-teknologi-informasi/",
  },
];

export default function EventSection() {
  return (
    <section className="bg-[#F3F3F3] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="text-4xl font-extrabold uppercase text-[#1D4ED8] md:text-5xl">
          Departemen
        </h3>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <article
              key={department.name}
              className="group flex h-full flex-col overflow-hidden border border-[#D9D9D9] bg-white transition-colors duration-300 hover:border-[#1D4ED8]"
            >
              <div className="relative h-56 w-full overflow-hidden bg-white">
                <img
                  src="/images/Event-Rektorat-Image.png"
                  alt={department.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-6 pt-6 transition-colors duration-300 group-hover:bg-[#1D4ED8]">
                <p className="text-3xl font-bold text-[#1D4ED8] transition-colors duration-300 group-hover:text-white md:text-[34px]">
                  {department.name}
                </p>
                <p className="mt-3 line-clamp-3 text-xl leading-relaxed text-black/90 transition-colors duration-300 group-hover:text-white md:text-2xl">
                  {department.description}
                </p>
                <Link
                  href={department.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto pt-5 inline-block text-sm font-medium uppercase text-black transition-colors duration-300 group-hover:text-white"
                >
                  Selengkapnya ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
