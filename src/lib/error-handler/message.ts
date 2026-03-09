import { DEFAULT_ERROR_MESSAGE } from "@/lib/error-handler/constants";

type ApiValidationMessage = Record<string, string[]>;
type ApiMessage = string | ApiValidationMessage | undefined;

function firstValidationMessage(
  message: ApiValidationMessage,
): string | undefined {
  const firstKey = Object.keys(message)[0];
  if (!firstKey) return undefined;

  const value = message[firstKey];
  if (!Array.isArray(value)) return undefined;

  return value[0];
}

export function parseApiMessage(message: ApiMessage): string {
  if (typeof message === "string") {
    return message;
  }

  if (message && typeof message === "object") {
    return firstValidationMessage(message) || DEFAULT_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
}
