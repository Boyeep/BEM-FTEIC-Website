// useSignupMutation hook
// React Query mutation hook for user registration.
// Calls authService.signup and handles post-signup flow.

import { authService } from "@/features/auth/services/authService";
import { SignupRequest } from "@/features/auth/types";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: SignupRequest) => authService.signup(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Account created! Check your inbox.");
      router.push("/check-inbox");
    },
    onError: (error: unknown) => {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || "Signup failed. Please try again."
        : "Signup failed. Please try again.";
      toast.error(message);
    },
  });
}
