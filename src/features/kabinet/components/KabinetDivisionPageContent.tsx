"use client";

import { UserRound } from "lucide-react";
import { type MouseEvent } from "react";

import ScrollReveal from "@/components/ScrollReveal";
import { KabinetDivision } from "@/features/kabinet/data";

interface KabinetDivisionPageContentProps {
  division: KabinetDivision;
}

export default function KabinetDivisionPageContent({
  division,
}: KabinetDivisionPageContentProps) {
  const handleMeetTeamClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const memberSection = document.getElementById("kabinet-members");
    if (!memberSection) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const sectionTop =
      memberSection.getBoundingClientRect().top + window.scrollY;
    const targetTop = Math.max(
      0,
      sectionTop + memberSection.offsetHeight / 2 - window.innerHeight / 2 - 6,
    );

    window.scrollTo({
      top: targetTop,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <main className="bg-[#F3F3F3] text-black">
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#E8B95A] px-6 pb-14 pt-28 md:px-10 md:pb-16 md:pt-32">
        <div className="relative mx-auto w-full max-w-7xl">
          <ScrollReveal delay={40}>
            <div className="mx-auto max-w-6xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-black/42">
                Kabinet Division
              </p>
              <h1 className="mt-5 text-4xl font-extrabold leading-[0.94] tracking-[-0.04em] text-black md:text-6xl lg:text-[5.5rem]">
                {division.title}
              </h1>
              <p className="mx-auto mt-6 max-w-5xl text-base leading-relaxed text-black/72 md:text-[1.35rem]/[1.5]">
                {division.description}
              </p>
              <div className="mt-10 flex justify-center">
                <a
                  href="#kabinet-members"
                  onClick={handleMeetTeamClick}
                  className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#FCD704] transition-transform duration-300 hover:-translate-y-0.5 hover:[filter:drop-shadow(0_0_14px_rgba(0,0,0,0.18))] md:px-9 md:py-4"
                >
                  Meet The Team
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section
        id="kabinet-members"
        className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#3F69D9] px-6 py-16 text-white scroll-mt-24 md:px-10 md:py-20"
      >
        <div className="relative mx-auto w-full max-w-[70rem] translate-y-3 md:translate-y-4">
          <ScrollReveal delay={40}>
            <div className="mb-10 text-center md:mb-12">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#FCD704]">
                Division Members
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold leading-relaxed text-[#FCD704] md:text-3xl">
                The people behind {division.title}.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:gap-x-7 md:gap-y-12 xl:grid-cols-3 xl:gap-x-8 xl:gap-y-14">
            {division.members.map((member, idx) => (
              <ScrollReveal
                key={`kabinet-member-${idx}`}
                delay={60 + idx * 20}
                className="h-full"
              >
                <article className="group mx-auto flex h-full w-full max-w-[21.25rem] flex-col items-center gap-4 border-t-[10px] border-black bg-[#E8B95A] p-[1.05rem] text-black transition-transform duration-300 hover:-translate-y-1 md:min-h-[188px] md:max-w-[22.5rem] md:flex-row md:items-center md:gap-4 md:border-l-[10px] md:border-t-0 md:p-[1.15rem]">
                  <div className="relative aspect-square w-full max-w-[7.75rem] shrink-0 overflow-hidden bg-[#F1CB74] md:w-[8.5rem] md:max-w-none">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(0,0,0,0.03))]" />
                    <div className="relative flex h-full w-full items-center justify-center">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#F1CB74]">
                          <UserRound
                            size={56}
                            strokeWidth={1.8}
                            className="text-black/26 md:h-16 md:w-16"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col items-center justify-center text-center md:items-start md:text-left">
                    <h3 className="break-words text-[1.05rem] font-bold leading-tight text-black [overflow-wrap:anywhere] md:text-[1.65rem]">
                      {member.name}
                    </h3>
                    <p className="mt-2 break-words text-[0.9rem] leading-relaxed font-medium text-black [overflow-wrap:anywhere] md:text-[1.05rem]">
                      {member.position}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
