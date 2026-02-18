// useLoginMutation hook
// React Query mutation hook for user login.
// Calls authService.login and manages loading/error states.

import { authService } from "@/features/auth/services/authService";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { LoginRequest } from "@/features/auth/types";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export function useLoginMutation() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success("Login successful!");
    },
    onError: (error: unknown) => {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || "Login failed. Please try again."
        : "Login failed. Please try again.";
      toast.error(message);
    },
  });
}
