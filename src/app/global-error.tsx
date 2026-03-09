"use client";

import { useEffect } from "react";

import ErrorPanel from "@/components/error/ErrorPanel";
import ErrorRetryButton from "@/components/error/ErrorRetryButton";

export default function GlobalError({
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
    <html>
      <body>
        <ErrorPanel
          title="Critical Error"
          description="A critical error occurred at the application root level."
          action={<ErrorRetryButton onRetry={() => reset()} />}
        />
      </body>
    </html>
  );
}
