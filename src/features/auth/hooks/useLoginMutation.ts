// useLoginMutation hook
// React Query mutation hook for user login.
// Calls authService.login and manages loading/error states.

import { authService } from "@/features/auth/services/authService";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { LoginRequest } from "@/features/auth/types";
import { setToken } from "@/lib/cookies";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useLoginMutation() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      setToken(data.accessToken);
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      toast.error(message);
    },
  });
}
