"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authApi } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/features/auth/stores/auth-store";

function subscribeToHydration(onStoreChange: () => void) {
  return useAuthStore.persist.onFinishHydration(onStoreChange);
}

function SessionLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center gap-2 text-sm text-gray-500"
    >
      <Loader2
        className="size-5 animate-spin motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span>Chargement de la session…</span>
    </div>
  );
}

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Persisted state is only available on the client. The server snapshot keeps
  // the first render identical on both sides, then React picks up the hydrated
  // client snapshot without a hydration mismatch.
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  useEffect(() => {
    if (!isHydrated || isAuthenticated) return;
    router.replace("/login");
  }, [isHydrated, isAuthenticated, router]);

  useEffect(() => {
    // The access token is intentionally not persisted: after a reload it is
    // restored from the httpOnly refresh cookie before protected queries run.
    if (!isHydrated || !isAuthenticated || accessToken) return;

    let cancelled = false;

    authApi
      .refresh()
      .then((token) => {
        if (!cancelled) setAccessToken(token);
      })
      .catch(() => {
        if (!cancelled) {
          clearAuth();
          router.replace("/login");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    isHydrated,
    isAuthenticated,
    accessToken,
    router,
    setAccessToken,
    clearAuth,
  ]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  // While the cookie-based refresh is in flight, hold the protected tree so no
  // API query races the token restoration.
  if (!accessToken) {
    return <SessionLoader />;
  }

  return <>{children}</>;
}
