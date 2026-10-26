"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthResponse } from "@/features/auth/types";

interface AuthState {
  userId: number | null;
  tenantSlug: string | null;
  accessToken: string | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;

  setAuth: (response: AuthResponse) => void;
  clearAuth: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (...roles: string[]) => boolean;
}

const initialState = {
  userId: null,
  tenantSlug: null,
  accessToken: null,
  roles: [],
  permissions: [],
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (response) => {
        set({
          userId: response.userId,
          tenantSlug: response.tenantSlug,
          accessToken: response.accessToken,
          roles: response.roles,
          permissions: response.permissions,
          isAuthenticated: true,
        });
      },

      clearAuth: () => set(initialState),

      hasRole: (role) => get().roles.includes(role),
      hasPermission: (permission) => get().permissions.includes(permission),
      hasAnyRole: (...roles) => roles.some((r) => get().roles.includes(r)),
    }),
    {
      name: "prodigo-auth",
      storage: createJSONStorage(() => localStorage),
      // accessToken is intentionally left out of persisted storage.
      // On reload, isAuthenticated + userId + tenantSlug survive, but
      // accessToken comes back null — use that as the trigger to silently
      // call /auth/refresh on app bootstrap and repopulate it via setAuth().
      partialize: (state) => ({
        userId: state.userId,
        tenantSlug: state.tenantSlug,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
