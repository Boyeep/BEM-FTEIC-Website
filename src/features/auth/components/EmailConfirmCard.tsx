// EmailConfirmCard component
// Displays email verification status and confirmation message.
// Used in verify-email flow after token validation.

"use client";

import Typography from "@/components/Typography";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import { Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type VerifyType = "signup" | "email";

export default function EmailConfirmCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hashParams, setHashParams] = useState<{
    code: string | null;
    tokenHash: string | null;
    type: VerifyType | null;
    accessToken: string | null;
    refreshToken: string | null;
  }>({
    code: null,
    tokenHash: null,
    type: null,
    accessToken: null,
    refreshToken: null,
  });
  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
  } = useVerifyEmail();
  const [mounted, setMounted] = useState(false);
  const hasSubmittedRef = useRef(false);

  const code = searchParams.get("code") ?? hashParams.code;
  const tokenHash = searchParams.get("token_hash") ?? hashParams.tokenHash;
  const rawType = searchParams.get("type") ?? hashParams.type;
  const type: VerifyType | null =
    rawType === "signup" || rawType === "email" ? rawType : null;
  const accessToken = hashParams.accessToken;
  const refreshToken = hashParams.refreshToken;

  const hasVerificationParams = useMemo(
    () => Boolean(code || tokenHash || (accessToken && refreshToken)),
    [code, tokenHash, accessToken, refreshToken],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const hashType = params.get("type");
    setHashParams({
      code: params.get("code"),
      tokenHash: params.get("token_hash"),
      type: hashType === "signup" || hashType === "email" ? hashType : null,
      accessToken: params.get("access_token"),
      refreshToken: params.get("refresh_token"),
    });
  }, [mounted]);

  useEffect(() => {
    if (!mounted || hasSubmittedRef.current || !hasVerificationParams) return;

    if (code) {
      hasSubmittedRef.current = true;
      verifyEmail({ code });
      return;
    }

    if (tokenHash && type) {
      hasSubmittedRef.current = true;
      verifyEmail({ tokenHash, type });
      return;
    }

    if (accessToken && refreshToken) {
      hasSubmittedRef.current = true;
      verifyEmail({ accessToken, refreshToken });
    }
  }, [
    mounted,
    hasVerificationParams,
    code,
    tokenHash,
    type,
    accessToken,
    refreshToken,
    verifyEmail,
  ]);

  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white p-10 rounded-[15px] shadow-sm w-full max-w-[420px] text-center flex flex-col items-center">
      {children}
    </div>
  );

  if (!mounted) return null;

  if (!hasVerificationParams) {
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
          Account successfully created
        </Typography>
        <Typography as="p" className="text-xs text-gray-500 mb-6">
          Your account is ready. Please log in to continue.
        </Typography>

        <button
          onClick={() => router.push("/login")}
          className="w-full bg-[#EBB85E] hover:brightness-95 text-black font-bold py-3 rounded-[10px] uppercase tracking-wider transition-all"
        >
          Go to Login
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
