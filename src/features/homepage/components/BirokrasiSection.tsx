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
        <div className="mx-auto max-w-7xl translate-y-7 px-6">
          <h3 className="text-4xl font-extrabold uppercase text-[#FCD704] md:text-5xl">
            BIROKRASI
          </h3>

          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
            {birokrasiMembers.map((person) => (
              <article key={person.role} className="flex items-start gap-7">
                <div className="h-44 w-44 shrink-0 bg-[#E6E6E6] md:h-52 md:w-52">
                  <div className="flex h-full items-center justify-center">
                    <div className="relative h-24 w-24 rounded-full bg-[#B7B7B7] md:h-32 md:w-32">
                      <div className="absolute left-1/2 top-8 h-10 w-10 -translate-x-1/2 rounded-full bg-[#E6E6E6]" />
                      <div className="absolute bottom-0 left-1/2 h-12 w-16 -translate-x-1/2 rounded-t-full bg-[#E6E6E6]" />
                    </div>
                  </div>
                </div>

                <div className="max-w-xs">
                  <p className="text-3xl font-bold md:text-4xl">
                    {person.name}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#FCD704] md:text-2xl">
                    {person.role}
                  </p>
                  <p className="mt-3 text-lg leading-relaxed text-white/95 md:text-2xl">
                    Ut vel tortor quis enim facilisis tempus nec ornare dolor.
                    Maecenas rhoncus ornare dolor.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <div aria-hidden="true" className="h-14 bg-[#1D4ED8]" />
    </>
  );
}
