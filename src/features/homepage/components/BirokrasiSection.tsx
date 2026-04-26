import ScrollReveal from "@/components/ScrollReveal";
import SwipeSideHint from "@/components/SwipeSideHint";

export default function BirokrasiSection() {
  return (
    <>
      <section className="flex min-h-[100svh] items-center bg-[#1D4ED8] py-16 text-white">
        <div className="mx-auto w-full max-w-7xl translate-y-7 px-6">
          <ScrollReveal delay={40}>
            <h3 className="text-center text-4xl font-extrabold uppercase text-[#FCD704] md:text-5xl">
              Dekan Fakultas Teknologi Elektro dan Informatika Cerdas
            </h3>
          </ScrollReveal>

          <div className="-mx-6 mt-10 flex w-auto snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
            <ScrollReveal
              delay={70 + 5 * 25}
              className="h-full w-[calc(100vw-3rem)] shrink-0 snap-center md:min-w-0 md:w-full"
            >
              <article className="flex h-full flex-col items-center gap-6 rounded-[1.75rem] bg-white/5 px-2 pb-6 pt-2 md:flex-row md:justify-center md:items-center md:gap-7 md:rounded-none md:bg-transparent md:p-0">
                <div className="h-72 w-full shrink-0 overflow-hidden rounded-[1.35rem] bg-[#E6E6E6] md:h-96 md:w-96 md:rounded-none">
                  <img
                    src="/images/Homepage-Dekan-FTEIC.jpeg"
                    className="h-full w-full object-cover"
                    alt="Dekan FTEIC"
                  />
                </div>

                <div className="w-full max-w-none px-3 text-left md:max-w-2xl md:px-0">
                  <p className="mt-4 text-lg leading-relaxed text-white/95 md:mt-3 md:text-2xl">
                    Proses transformasi digital di berbagai lini menjadi hal
                    yang harus dijalankan dalam menghadapi revolusi industri
                    4.0. FT-EIC diharapkan kolaborasi dan sinergi yang terjalin
                    antar bidang menjadi lebih baik lagi. Proses kerja sama dan
                    manajemen antar stakeholder terkait bisa lebih efisien dan
                    tepat sasaran.Program kerja sama dan inovasi juga akan lebih
                    dimaksimalkan lagi terutama kepada pihak pemerintah maupun
                    pihak internasional.
                  </p>
                  <p className="mt-2 text-xl font-bold text-[#FCD704] md:text-3xl">
                    Prof. Dr. Diana Purwitasari, S.Kom., M.Sc.
                  </p>
                </div>
              </article>
            </ScrollReveal>
          </div>

          <SwipeSideHint />
        </div>
      </section>
      <div aria-hidden="true" className="h-14 bg-[#1D4ED8]" />
    </>
  );
}
