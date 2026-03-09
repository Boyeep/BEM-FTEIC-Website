// Global providers (React Query, etc.)

"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  QueryOptions,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import AuthSessionSync from "@/features/auth/components/AuthSessionSync";
import api from "@/lib/api";
import { handleError } from "@/lib/handleError";

const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
  const { data } = await api.get(`${queryKey?.[0]}`);
  return data;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: handleError,
  }),
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionSync />
      <Toaster position="top-center" />
      {children}
    </QueryClientProvider>
  );
}
