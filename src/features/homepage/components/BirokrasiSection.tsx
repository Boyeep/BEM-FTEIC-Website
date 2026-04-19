import ScrollReveal from "@/components/ScrollReveal";
import SwipeSideHint from "@/components/SwipeSideHint";

const birokrasiMembers = [
  { name: "Lorem Ipsum", role: "DEKAN" },
  { name: "Lorem Ipsum", role: "WAKIL DEKAN" },
  { name: "Lorem Ipsum", role: "KETUA BEM" },
  { name: "Lorem Ipsum", role: "WAKIL KETUA BEM" },
];

export default function BirokrasiSection() {
  return (
    <>
      <section className="flex min-h-[100svh] items-center bg-[#1D4ED8] py-16 text-white">
        <div className="mx-auto w-full max-w-7xl translate-y-7 px-6">
          <ScrollReveal delay={40}>
            <h3 className="text-center text-4xl font-extrabold uppercase text-[#FCD704] md:text-left md:text-5xl">
              BIROKRASI
            </h3>
          </ScrollReveal>

          <div className="-mx-6 mt-10 flex w-auto snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-10 md:overflow-visible md:px-0 md:pb-0">
            {birokrasiMembers.map((person, index) => (
              <ScrollReveal
                key={person.role}
                delay={70 + index * 25}
                className="h-full w-[calc(100vw-3rem)] shrink-0 snap-center md:min-w-0 md:w-full"
              >
                <article className="flex h-full flex-col items-center gap-6 rounded-[1.75rem] bg-white/5 px-2 pb-6 pt-2 md:flex-row md:items-start md:gap-7 md:rounded-none md:bg-transparent md:p-0">
                  <div className="h-72 w-full shrink-0 rounded-[1.35rem] bg-[#E6E6E6] md:h-52 md:w-52 md:rounded-none">
                    <div className="flex h-full items-center justify-center">
                      <div className="relative h-28 w-28 rounded-full bg-[#B7B7B7] md:h-32 md:w-32">
                        <div className="absolute left-1/2 top-8 h-10 w-10 -translate-x-1/2 rounded-full bg-[#E6E6E6] md:top-8 md:h-10 md:w-10" />
                        <div className="absolute bottom-0 left-1/2 h-14 w-16 -translate-x-1/2 rounded-t-full bg-[#E6E6E6] md:h-12 md:w-16" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-none px-3 text-center md:max-w-xs md:px-0 md:text-left">
                    <p className="text-[2rem] font-bold leading-[1.02] md:text-4xl">
                      {person.name}
                    </p>
                    <p className="mt-2 text-xl font-bold text-[#FCD704] md:text-2xl">
                      {person.role}
                    </p>
                    <p className="mt-4 text-lg leading-relaxed text-white/95 md:mt-3 md:text-2xl">
                      Ut vel tortor quis enim facilisis tempus nec ornare dolor.
                      Maecenas rhoncus ornare dolor.
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <SwipeSideHint />
        </div>
      </section>
      <div aria-hidden="true" className="h-14 bg-[#1D4ED8]" />
    </>
  );
}
