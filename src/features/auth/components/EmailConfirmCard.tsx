// EmailConfirmCard component
// Displays email verification status and confirmation message.
// Used in verify-email flow after token validation.

"use client";

import Typography from "@/components/Typography";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import { Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailConfirmCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
  } = useVerifyEmail();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !token) return;
    verifyEmail({ token });
  }, [mounted, token, verifyEmail]);

  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white p-10 rounded-[15px] shadow-sm w-full max-w-[420px] text-center flex flex-col items-center">
      {children}
    </div>
  );

  if (!mounted) return null;

  if (!token) {
    return (
      <CardWrapper>
        <Typography as="h2" className="text-xl font-bold mb-2 text-red-500">
          Invalid Link
        </Typography>
        <Typography as="p" className="text-xs text-gray-500">
          The confirmation link is missing or invalid.
        </Typography>
      </CardWrapper>
    );
  }

  if (isPending) {
    return (
      <CardWrapper>
        <div className="animate-pulse bg-brand-blue/10 p-6 rounded-2xl mb-6">
          <Mail className="w-16 h-16 text-brand-blue" />
        </div>
        <Typography as="h2" className="text-xl font-bold">
          Verifying Email...
        </Typography>
      </CardWrapper>
    );
  }

  if (isSuccess) {
    return (
      <CardWrapper>
        <div className="relative bg-[#5172E8] p-6 rounded-2xl mb-6 shadow-md">
          <Mail className="w-16 h-16 text-white" />
          <div className="absolute top-1 right-1 w-4 h-4 bg-[#EBB85E] rounded-full border-2 border-white"></div>
        </div>

        <Typography as="h2" className="text-xl font-bold text-black mb-2">
          Email Verified!
        </Typography>
        <Typography as="p" className="text-xs text-gray-500 mb-6">
          Your email has been successfully verified. You&apos;re now logged in.
        </Typography>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-[#EBB85E] hover:brightness-95 text-black font-bold py-3 rounded-[10px] uppercase tracking-wider transition-all"
        >
          Go to Dashboard
        </button>
      </CardWrapper>
    );
  }

  if (isError) {
    return (
      <CardWrapper>
        <Typography as="h2" className="text-xl font-bold text-red-600 mb-2">
          Verification Failed
        </Typography>
        <Typography as="p" className="text-xs text-gray-500 mb-6">
          The link may have expired or is invalid.
        </Typography>
        <button
          onClick={() => router.push("/signup")}
          className="w-full bg-[#EBB85E] text-black font-bold py-3 rounded-[10px] uppercase"
        >
          Back to Signup
        </button>
      </CardWrapper>
    );
  }

  return null;
}
