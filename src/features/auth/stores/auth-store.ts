"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthResponse } from "@/features/auth/types";

export interface AuthState {
  userId: number | null;
  tenantSlug: string | null;
  accessToken: string | null;
  roles: string[];
  permissions: string[];
  enabledModules: string[];
  isAuthenticated: boolean;

  setAuth: (response: AuthResponse) => void;
  setSession: (session: Partial<AuthState>) => void;
  setEnabledModules: (modules: string[]) => void;
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
  enabledModules: [],
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
          roles: response.roles ?? [],
          permissions: response.permissions ?? [],
          isAuthenticated: true,
        });
      },

      setSession: (session) => {
        set((state) => ({
          ...state,
          ...session,
          isAuthenticated:
            session.isAuthenticated ?? state.isAuthenticated ?? Boolean(session.accessToken),
        }));
      },

      setEnabledModules: (modules) => {
        set({ enabledModules: modules ?? [] });
      },

      clearAuth: () => set(initialState),

      hasRole: (role) => get().roles.includes(role),
      hasPermission: (permission) => get().permissions.includes(permission),
      hasAnyRole: (...roles) => roles.some((r) => get().roles.includes(r)),
    }),
    {
      name: "prodigo-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        tenantSlug: state.tenantSlug,
        roles: state.roles,
        permissions: state.permissions,
        enabledModules: state.enabledModules,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
