"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // The persisted session is rehydrated from localStorage on the client.
    // Read the store directly so a server-rendered "false" snapshot cannot
    // redirect an authenticated user before hydration completes.
    if (!useAuthStore.persist.hasHydrated()) return;
    if (!useAuthStore.getState().isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
