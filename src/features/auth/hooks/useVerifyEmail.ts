// useVerifyEmail hook
// Handles email verification logic using verification token.
// Calls authService.verifyEmail and manages confirmation state.

import { authService } from "@/features/auth/services/authService";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { VerifyEmailRequest } from "@/features/auth/types";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useVerifyEmail() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (payload: VerifyEmailRequest) =>
      authService.verifyEmail(payload),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success("Email verified successfully!");
      router.push("/");
    },
    onError: (error: unknown) => {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ||
          "Email verification failed. Please try again."
        : "Email verification failed. Please try again.";
      toast.error(message);
    },
  });
}
