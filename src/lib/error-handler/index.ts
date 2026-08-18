import type { AxiosError } from "axios";
import toast from "react-hot-toast";

import { DEFAULT_ERROR_MESSAGE } from "@/lib/error-handler/constants";
import {
  getErrorRedirectPath,
  redirectToErrorPage,
} from "@/lib/error-handler/redirect";
import { ApiFailure } from "@/types/api";

function handleAxiosError(error: AxiosError<ApiFailure>): void {
  const statusCode = error.response?.status;
  const redirectPath = getErrorRedirectPath(statusCode);

  if (redirectPath) {
    redirectToErrorPage(redirectPath);
    return;
  }

  const message = error.response?.data?.error?.message;
  toast.error(message || error.message || DEFAULT_ERROR_MESSAGE);
}

function isAxiosError(error: unknown): error is AxiosError<ApiFailure> {
  return (
    error instanceof Error &&
    (error as AxiosError<ApiFailure>).isAxiosError === true
  );
}

export function handleError(error: unknown): void {
  if (isAxiosError(error)) {
    handleAxiosError(error);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message || DEFAULT_ERROR_MESSAGE);
    return;
  }

  if (typeof error === "string") {
    toast.error(error || DEFAULT_ERROR_MESSAGE);
    return;
  }

  toast.error(DEFAULT_ERROR_MESSAGE);
}
