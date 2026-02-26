import Image from "next/image";

export default function DepartemenSection() {
  return (
    <section className="bg-[#F3F3F3] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="text-4xl font-extrabold uppercase text-[#1D4ED8] md:text-5xl">
          DEPARTEMEN
        </h3>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <article key={`departemen-${index}`}>
              <div className="relative h-56 w-full overflow-hidden bg-white">
                <Image
                  src="/images/Homepage-About-Image.png"
                  alt="Departemen"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-5 pb-1 pt-6">
                <p className="text-3xl font-bold text-[#1D4ED8] md:text-[34px]">
                  Nama Departemen
                </p>
                <p className="mt-3 text-xl leading-relaxed text-black/90 md:text-2xl">
                  Ut vel tortor quis enim facilisis tempus nec ornare dolor.
                  Maecenas rhoncus ornare dolor.
                </p>
                <p className="mt-4 text-sm font-medium uppercase text-black">
                  Selengkapnya ↗
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
