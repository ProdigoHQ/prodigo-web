import axios from "axios";
import { ApiError, toApiError } from "@/lib/http/api-error";

type RefreshResponse = {
  accessToken: string;
};

/**
 * The refresh token is an httpOnly cookie, so it is only sent and stored when
 * requests opt into credentials.
 */
const sessionClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

/**
 * Exchanges the `refresh_token` cookie for a new access token.
 *
 * Concurrent callers share the same in-flight request: the backend rotates the
 * refresh cookie on every call, so sending two refreshes in parallel would use
 * an already-revoked token.
 */
export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = sessionClient
      .get<RefreshResponse>("/auth/refresh")
      .then(({ data }) => {
        if (!data.accessToken) {
          throw new ApiError(
            "Votre session a expiré. Veuillez vous reconnecter.",
            401,
          );
        }
        return data.accessToken;
      })
      .catch((error) => {
        throw toApiError(error);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

/** Clears the httpOnly refresh cookie and revokes the refresh token. */
export async function logoutSession(): Promise<void> {
  try {
    await sessionClient.get("/auth/logout");
  } catch (error) {
    throw toApiError(error);
  }
}
