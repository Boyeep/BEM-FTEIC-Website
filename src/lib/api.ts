import axios, { AxiosError } from "axios";

import { supabase } from "@/lib/supabase";
import { ApiFailure } from "@/types/api";

export const baseURL =
  process.env.NEXT_PUBLIC_RUN_MODE === "development"
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : process.env.NEXT_PUBLIC_API_URL_PROD;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: false,
});

api.defaults.withCredentials = false;
const isBrowser = typeof window !== "undefined";

api.interceptors.request.use(async function (config) {
  if (config.headers) {
    let token: string | undefined;

    if (isBrowser) {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    }

    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }

  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error: AxiosError<ApiFailure>) => {
    const backendError = error.response?.data;
    if (backendError?.error?.message) {
      return Promise.reject(new Error(backendError.error.message));
    }
    return Promise.reject(error);
  },
);
export default api;
