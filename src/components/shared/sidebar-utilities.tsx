"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarItemClassName } from "@/components/shared/sidebar-nav-item";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export default function SidebarUtilities() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { state, isMobile, setOpenMobile, toggleSidebar } = useSidebar();

  const collapsed = state === "collapsed";
  const toggleLabel = isMobile
    ? "Fermer"
    : collapsed
      ? "Déployer"
      : "Réduire";
  const ToggleIcon = collapsed && !isMobile ? ChevronRight : ChevronLeft;

  function handleLogout() {
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
            tooltip="Déconnexion"
            aria-label="Déconnexion"
            className={sidebarItemClassName}
            onClick={handleLogout}
          >
            <LogOut aria-hidden="true" />
            <span className="truncate group-data-[collapsible=icon]:hidden">
              Déconnexion
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
