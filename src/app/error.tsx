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
      title="Error"
      description="500 Internal Service Error"
      titleAs="h2"
      action={<ErrorRetryButton onRetry={() => reset()} label="Try Again" />}
    />
  );
}
