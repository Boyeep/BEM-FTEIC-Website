"use client";

import { useEffect } from "react";

import ErrorPanel from "@/components/error/ErrorPanel";
import ErrorRetryButton from "@/components/error/ErrorRetryButton";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorPanel
      title="Something went wrong!"
      description="A rendering error occurred in this section of the application."
      containerClassName="flex min-h-[400px] w-full flex-col items-center justify-center p-4 text-center"
      cardClassName="flex max-w-md flex-col items-center rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
      titleAs="h2"
      iconSize={32}
      actionSpacingClassName="mb-6"
      action={<ErrorRetryButton onRetry={() => reset()} />}
    />
  );
}
