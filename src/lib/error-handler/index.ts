import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { DEFAULT_ERROR_MESSAGE } from "@/lib/error-handler/constants";
import { parseApiMessage } from "@/lib/error-handler/message";
import {
  getErrorRedirectPath,
  redirectToErrorPage,
} from "@/lib/error-handler/redirect";
import { UninterceptedApiError } from "@/types/api";

function handleAxiosError(error: AxiosError<UninterceptedApiError>): void {
  const statusCode = error.response?.status;
  const redirectPath = getErrorRedirectPath(statusCode);

  if (redirectPath) {
    redirectToErrorPage(redirectPath);
    return;
  }

  const message = parseApiMessage(error.response?.data?.message);
  toast.error(message || error.message || DEFAULT_ERROR_MESSAGE);
}

export function handleError(error: unknown): void {
  if (error instanceof AxiosError) {
    handleAxiosError(error as AxiosError<UninterceptedApiError>);
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
