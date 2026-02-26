import Image from "next/image";
import Link from "next/link";

export default function BlogSection() {
  return (
    <section className="bg-[#1D4ED8] pb-36 pt-20 text-white">
      <div className="mx-auto max-w-6xl translate-y-10 px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-4xl font-extrabold uppercase text-[#FCD704] md:text-5xl">
            BLOG
          </h3>
          <Link
            href="/blog"
            className="text-sm font-medium uppercase hover:text-white/80 md:text-base"
          >
            LIHAT SEMUA ↗
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <article className="lg:col-span-7">
            <div className="relative h-72 w-full overflow-hidden md:h-80">
              <Image
                src="/images/Homepage-About-Image.png"
                alt="Blog highlight"
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase text-[#FCD704]">
              TEKNIK ELEKTRO
            </p>
            <h4 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
              Lorem Ipsum Dolor Sit: A Famet Morbi Mollis Risus Pellentesque id
              Orci Eget
            </h4>
            <p className="mt-4 text-xl leading-relaxed text-white/85 md:text-2xl">
              Ut vel tortor quis enim facilisis tempus nec ornare dolor.
              Maecenas rhoncus ornare dolor. Ut vel tortor quis enim facilisis
              tempus nec...
            </p>
          </article>

          <div className="space-y-5 lg:col-span-5">
            {Array.from({ length: 4 }, (_, index) => (
              <article key={`home-blog-${index}`} className="flex gap-4">
                <div className="relative h-24 w-44 shrink-0 overflow-hidden md:h-28 md:w-48">
                  <Image
                    src="/images/Homepage-Hero-Image.png"
                    alt="Blog list"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#FCD704]">
                    FTEIC
                  </p>
                  <h5 className="mt-1 text-3xl font-bold leading-tight md:text-4xl">
                    Judul Blog
                  </h5>
                  <p className="mt-1 text-sm text-white/90 md:text-base">
                    Lorem Ipsum Dolor sit Amet
                  </p>
                  <p className="mt-2 text-sm font-medium uppercase text-white/95">
                    BACA ↗
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
