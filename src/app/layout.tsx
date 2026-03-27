// Root layout

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import Providers from "@/app/providers";
import AppShell from "@/layouts/AppShell";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BEM-FTEIC Website",
  description: "Akhirnya bisa tidur ges",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <noscript>
          <style>{`
            .scroll-reveal,
            .scroll-reveal-hidden,
            .scroll-reveal-visible {
              opacity: 1 !important;
              filter: none !important;
              transform: none !important;
              animation: none !important;
            }
          `}</style>
        </noscript>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
