import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { toApiError } from "@/lib/http/api-error";
import { refreshAccessToken } from "@/lib/http/auth-session";

const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
];

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15_000,
  // The API also uses httpOnly cookies (refresh token); credentials must be
  // included for the browser to send and store them.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

function isAuthEndpoint(url: string | undefined) {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.assign(new URL("/login", window.location.origin).toString());
  }
}

function clearSessionAndRedirect() {
  useAuthStore.getState().clearAuth();
  redirectToLogin();
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(toApiError(error));
    }

    const status = error.response?.status ?? 0;
    const config = error.config as RetryableRequestConfig | undefined;
    const isAuthCall = isAuthEndpoint(config?.url);

    if (status === 401 && config && !config._retry && !isAuthCall) {
      config._retry = true;

      // Another request may have already refreshed the token while this one
      // was in flight. Reuse the current token instead of rotating the
      // refresh cookie again.
      const currentToken = useAuthStore.getState().accessToken;
      const sentToken = config.headers.get("Authorization");
      if (currentToken && sentToken !== `Bearer ${currentToken}`) {
        config.headers.set("Authorization", `Bearer ${currentToken}`);
        return httpClient(config);
      }

      try {
        const accessToken = await refreshAccessToken();
        useAuthStore.getState().setAccessToken(accessToken);
        config.headers.set("Authorization", `Bearer ${accessToken}`);
        return httpClient(config);
      } catch {
        clearSessionAndRedirect();
        return Promise.reject(toApiError(error));
      }
    }

    if (status === 401 && !isAuthCall) {
      clearSessionAndRedirect();
    }

    return Promise.reject(toApiError(error));
  },
);
