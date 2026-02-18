// /confirm-email page

import { Suspense } from "react";

import EmailConfirmCard from "@/features/auth/components/EmailConfirmCard";

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={null}>
      <EmailConfirmCard />
    </Suspense>
  );
}
