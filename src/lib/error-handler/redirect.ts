import { ERROR_ROUTES } from "@/lib/error-handler/constants";

export function getErrorRedirectPath(statusCode?: number): string | null {
  if (statusCode === 404) {
    return ERROR_ROUTES.notFound;
  }

  if (statusCode === 403) {
    return ERROR_ROUTES.forbidden;
  }

  if (statusCode === 503) {
    return ERROR_ROUTES.serviceUnavailable;
  }

  if (statusCode && statusCode >= 500) {
    return ERROR_ROUTES.serverError;
  }

  return null;
}

export function redirectToErrorPage(path: string): void {
  if (typeof window === "undefined") return;
  window.location.href = path;
}
