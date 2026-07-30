import Link from "next/link";

import { DASHBOARD_NAV_ITEMS } from "./dashboardNavItems";

export function DashboardMobileNavigation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return open ? (
    <nav
      aria-label="Navigasi dashboard mobile"
      className="absolute left-4 top-[56px] w-[220px] border-b-2 border-[#365BD7] bg-[#D9D9D9] p-2 shadow-xl md:hidden"
    >
      {DASHBOARD_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="flex min-h-11 items-center px-3 py-2 text-[14px] font-semibold text-black hover:bg-[#ECECEC] focus-visible:ring-2 focus-visible:ring-[#365BD7]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  ) : null;
}
