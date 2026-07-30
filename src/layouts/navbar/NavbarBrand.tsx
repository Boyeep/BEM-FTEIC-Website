import Image from "next/image";
import Link from "next/link";

import clsxm from "@/lib/clsxm";

export function NavbarBrand({ transparent }: { transparent: boolean }) {
  return (
    <Link
      href="/"
      className={clsxm(
        "inline-flex min-h-11 items-center gap-2 text-3xl font-extrabold leading-none focus-visible:ring-2 focus-visible:ring-current md:gap-3 md:text-4xl",
        transparent ? "text-white" : "text-black",
      )}
    >
      <Image
        src="/images/event-departemen-logo/logo-bem-fteic.png"
        alt="Logo BEM FTEIC"
        width={40}
        height={40}
        className="h-8 w-8 object-contain md:h-10 md:w-10"
        priority
      />
      <span>BEM FTEIC</span>
    </Link>
  );
}
