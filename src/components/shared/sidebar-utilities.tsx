"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, LogOut } from "lucide-react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarItemClassName } from "@/components/shared/sidebar-nav-item";
import { authApi } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export default function SidebarUtilities() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { state, isMobile, setOpenMobile, toggleSidebar } = useSidebar();

  const collapsed = state === "collapsed";
  const toggleLabel = isMobile
    ? "Fermer"
    : collapsed
      ? "Déployer"
      : "Réduire";
  const ToggleIcon = collapsed && !isMobile ? ChevronRight : ChevronLeft;

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      // Revokes the refresh token and clears the httpOnly cookie server-side.
      await authApi.logout();
    } catch {
      // A failed server logout must not trap the user in the session.
    }

    queryClient.clear();
    clearAuth();
    if (isMobile) setOpenMobile(false);
    router.replace("/login");
  }

  return (
    <SidebarFooter className="mt-auto border-t border-sidebar-border p-4 group-data-[collapsible=icon]:p-2">
      <SidebarMenu className="gap-1.5">
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={toggleLabel}
            aria-label={toggleLabel}
            className={sidebarItemClassName}
            onClick={toggleSidebar}
          >
            <ToggleIcon aria-hidden="true" />
            <span className="truncate group-data-[collapsible=icon]:hidden">
              {toggleLabel}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={isLoggingOut ? "Déconnexion…" : "Déconnexion"}
            aria-label={isLoggingOut ? "Déconnexion en cours" : "Déconnexion"}
            aria-busy={isLoggingOut}
            className={sidebarItemClassName}
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            {isLoggingOut ? (
              <Loader2
                className="animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <LogOut aria-hidden="true" />
            )}
            <span className="truncate group-data-[collapsible=icon]:hidden">
              {isLoggingOut ? "Déconnexion…" : "Déconnexion"}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
