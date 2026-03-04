// useVerifyEmail hook
// Handles email verification logic using verification token.
// Calls authService.verifyEmail and manages confirmation state.

import { authService } from "@/features/auth/services/authService";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { VerifyEmailRequest } from "@/features/auth/types";
import { setToken } from "@/lib/cookies";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useVerifyEmail() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (payload: VerifyEmailRequest) =>
      authService.verifyEmail(payload),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      setToken(data.accessToken);
      toast.success("Email verified successfully!");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Email verification failed. Please try again.";
      toast.error(message);
    },
  });
}
