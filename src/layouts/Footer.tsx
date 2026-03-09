import {
  Instagram,
  Linkedin,
  Mail,
  Music2,
  Phone,
  Youtube,
} from "lucide-react";
import Link from "next/link";

const pages = [
  { label: "Blog", href: "/blog" },
  { label: "Event", href: "/event" },
  { label: "Kabinet", href: "/#kabinet" },
  { label: "Galeri", href: "/galeri" },
];
const event = [
  { label: "Teknik Elektro", href: "/event/teknik-elektro" },
  { label: "Teknik Informatika", href: "/event/teknik-informatika" },
  { label: "Sistem Informasi", href: "/event/sistem-informasi" },
  { label: "Teknik Komputer", href: "/event/teknik-komputer" },
  { label: "Teknik Biomedik", href: "/event/teknik-biomedik" },
  { label: "Teknologi Informasi", href: "/event/teknologi-informasi" },
];

export default function Footer() {
  return (
    <footer className="mt-10 overflow-hidden bg-black text-white">
      <div className="mx-auto max-w-[1460px] px-8 pb-0 pt-6 md:px-16 md:pb-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <h2 className="text-5xl font-extrabold uppercase">BEM FTEIC ITS</h2>
            <div className="mt-7 space-y-3 text-xl text-white/70">
              <p className="flex items-center gap-3">
                <Phone size={18} />
                +62 123-4567-8901
              </p>
              <p className="flex items-center gap-3">
                <Mail size={18} />
                email@email.com
              </p>
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
                  {event.map((item) => (
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
                <h3 className="mb-2 text-2xl font-semibold uppercase md:mb-3">
                  Social
                </h3>
                <div className="flex items-center gap-3 text-white">
                  <Link
                    href="#"
                    aria-label="TikTok"
                    className="hover:text-[#FCD704]"
                  >
                    <Music2 size={22} />
                  </Link>
                  <Link
                    href="#"
                    aria-label="LinkedIn"
                    className="hover:text-[#FCD704]"
                  >
                    <Linkedin size={22} />
                  </Link>
                  <Link
                    href="#"
                    aria-label="Instagram"
                    className="hover:text-[#FCD704]"
                  >
                    <Instagram size={22} />
                  </Link>
                  <Link
                    href="#"
                    aria-label="YouTube"
                    className="hover:text-[#FCD704]"
                  >
                    <Youtube size={22} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="translate-y-14 mt-5 text-lg text-white/80 md:mt-8">
          © Lorem ipsum dolor sit amet 2026. Consectetur adipiscing elit.
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
