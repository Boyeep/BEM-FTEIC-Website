// Auth layout

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#5172E8] to-[#DCE6FF] p-4 font-inter">
      <main className="w-full flex justify-center items-center">
        {children}
      </main>
    </div>
  );
}
