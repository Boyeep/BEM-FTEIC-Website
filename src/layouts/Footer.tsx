"use client";

import {
  ChevronRight,
  Instagram,
  Linkedin,
  Mail,
  Music2,
  Phone,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { type TransitionEvent, useState } from "react";

import { departments } from "@/features/homepage/data/departments";

const pages = [
  { label: "Blog", href: "/blog" },
  { label: "Event", href: "/event/fteic" },
  { label: "Kabinet", href: "/#kabinet" },
  { label: "Galeri", href: "/galeri" },
];

const socialLinks = [
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@bemfteic.its",
    icon: Music2,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/bem-fteic/",
    icon: Linkedin,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/bemfteic.its/",
    icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/results?search_query=BEM+FTEIC+ITS",
    icon: Youtube,
  },
];

function FooterDepartmentItem({
  department,
}: {
  department: (typeof departments)[number];
}) {
  const entries = [
    { label: `Dept. ${department.name}`, href: department.href },
    ...(department.programs?.map((program) => ({
      label: program.name,
      href: program.href,
    })) ?? []),
  ];
  const [activeEntryIndex, setActiveEntryIndex] = useState(0);
  const [outgoingEntryIndex, setOutgoingEntryIndex] = useState<number | null>(
    null,
  );
  const [incomingEntryIndex, setIncomingEntryIndex] = useState<number | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const isSlidable = entries.length > 1;
  const activeEntry = entries[activeEntryIndex];
  const outgoingEntry =
    outgoingEntryIndex !== null ? entries[outgoingEntryIndex] : null;
  const incomingEntry =
    incomingEntryIndex !== null ? entries[incomingEntryIndex] : null;

  const handleNextEntry = () => {
    if (!isSlidable || isAnimating) {
      return;
    }

    const nextEntryIndex = (activeEntryIndex + 1) % entries.length;

    setOutgoingEntryIndex(activeEntryIndex);
    setIncomingEntryIndex(nextEntryIndex);
    window.requestAnimationFrame(() => {
      setIsAnimating(true);
    });
  };

  const handleIncomingTransitionEnd = (
    event: TransitionEvent<HTMLAnchorElement>,
  ) => {
    if (event.propertyName !== "transform" || incomingEntryIndex === null) {
      return;
    }

    setActiveEntryIndex(incomingEntryIndex);
    setOutgoingEntryIndex(null);
    setIncomingEntryIndex(null);
    setIsAnimating(false);
  };

  return (
    <li className="grid w-[250px] max-w-full grid-cols-[minmax(0,1fr)_2rem] items-center gap-2">
      <div className="relative h-8 overflow-hidden">
        {outgoingEntry ? (
          <Link
            href={outgoingEntry.href}
            target="_blank"
            rel="noreferrer"
            title={outgoingEntry.label}
            className="pointer-events-none absolute left-0 top-1/2 inline-flex w-full -translate-y-1/2 items-center text-white/70 transition-[transform] duration-300"
            style={{
              transform: isAnimating
                ? "translate(100%, -50%)"
                : "translate(0, -50%)",
            }}
          >
            <span className="truncate whitespace-nowrap">
              {outgoingEntry.label}
            </span>
          </Link>
        ) : null}

        {!isAnimating && outgoingEntry === null ? (
          <Link
            href={activeEntry.href}
            target="_blank"
            rel="noreferrer"
            title={activeEntry.label}
            className="group absolute left-0 top-1/2 inline-flex w-full -translate-y-1/2 items-center text-white/70 transition-colors hover:text-white"
            style={{
              transform: "translate(0, -50%)",
            }}
          >
            <span className="inline-block max-w-full truncate whitespace-nowrap bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-200 group-hover:bg-[length:100%_2px]">
              {activeEntry.label}
            </span>
          </Link>
        ) : null}

        {incomingEntry ? (
          <Link
            href={incomingEntry.href}
            target="_blank"
            rel="noreferrer"
            title={incomingEntry.label}
            onTransitionEnd={handleIncomingTransitionEnd}
            className="group absolute left-0 top-1/2 inline-flex w-full -translate-y-1/2 items-center text-white/70 transition-[transform,color] duration-300 hover:text-white"
            style={{
              transform: isAnimating
                ? "translate(0, -50%)"
                : "translate(-100%, -50%)",
            }}
          >
            <span className="inline-block max-w-full truncate whitespace-nowrap bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-200 group-hover:bg-[length:100%_2px]">
              {incomingEntry.label}
            </span>
          </Link>
        ) : null}
      </div>

      {isSlidable ? (
        <button
          type="button"
          onClick={handleNextEntry}
          className="relative z-10 inline-flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isAnimating}
          aria-label={`Tampilkan prodi berikutnya untuk ${department.name}`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : (
        <span className="h-8 w-8" aria-hidden="true" />
      )}
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="mt-10 overflow-hidden bg-black text-white">
      <div className="mx-auto max-w-[1460px] px-8 pb-0 pt-6 md:px-16 md:pb-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <h2 className="text-5xl font-extrabold uppercase">BEM FTEIC ITS</h2>
            <div className="mt-7 space-y-3 text-xl text-white/70">
              <a
                href="https://wa.me/6285236589132"
                target="_blank"
                rel="noreferrer"
                aria-label="Hubungi Mas Ilman melalui WhatsApp di +62 852-3658-9132"
                className="group flex w-fit items-center gap-3 rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD704] focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              >
                <Phone size={18} aria-hidden="true" />
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-200 group-hover:bg-[length:100%_2px]">
                  +62 852-3658-9132 (Mas Ilman)
                </span>
              </a>
              <a
                href="mailto:bemfteicits2603@gmail.com"
                aria-label="Kirim email ke bemfteicits2603@gmail.com"
                className="group flex w-fit items-center gap-3 rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD704] focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              >
                <Mail size={18} aria-hidden="true" />
                <span className="break-all bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-200 group-hover:bg-[length:100%_2px]">
                  bemfteicits2603@gmail.com
                </span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3 md:flex md:justify-end">
            <div className="grid grid-cols-1 gap-10 text-base md:w-[760px] md:grid-cols-3">
              <div>
                <h3 className="mb-3 text-2xl font-semibold uppercase">
                  Halaman
                </h3>
                <ul className="space-y-2 text-white/70">
                  {pages.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="relative inline-block transition-colors hover:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-2xl font-semibold uppercase">
                  Departemen
                </h3>
                <ul className="space-y-2 text-white/70">
                  {departments.map((department) => (
                    <FooterDepartmentItem
                      key={department.name}
                      department={department}
                    />
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-2xl font-semibold uppercase md:mb-3">
                  Social
                </h3>
                <div className="flex items-center gap-1 text-white">
                  {socialLinks.map((social) => {
                    const SocialIcon = social.icon;

                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Buka ${social.label} BEM FTEIC ITS`}
                        title={social.label}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10 hover:text-[#FCD704] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD704]"
                      >
                        <SocialIcon size={22} aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 text-sm text-white/70 md:mt-16 md:text-base">
          © 2026 BEM FTEIC ITS. Seluruh hak cipta dilindungi.
        </p>
      </div>

      <div className="pointer-events-none h-40 pt-0 select-none overflow-hidden">
        <p className="translate-y-28 -translate-x-1 whitespace-nowrap text-center text-[21.7vw] font-black uppercase leading-none tracking-[-0.045em] text-[#FCD704] md:-translate-y-6">
          ELECTICS
        </p>
      </div>
    </footer>
  );
}
