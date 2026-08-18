// Global providers (React Query, etc.)

"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { handleError } from "@/lib/handleError";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleError,
  }),
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      {children}
    </QueryClientProvider>
  );
}
