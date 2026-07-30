import Link from "next/link";

import { DASHBOARD_NAV_ITEMS } from "./dashboardNavItems";

export function DashboardNavigation() {
  return (
    <nav
      aria-label="Navigasi dashboard"
      className="hidden items-center gap-7 text-[14px] text-black md:flex"
    >
      {DASHBOARD_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="inline-flex min-h-11 items-center hover:opacity-75 focus-visible:ring-2 focus-visible:ring-black"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
