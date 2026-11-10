"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  getNavigationForPermissions,
  getPlatformNavigationForPermissions,
  groupNavigationItems,
  type NavigationGroup,
} from "@/components/shared/navigation";
import SidebarBrand from "@/components/shared/sidebar-brand";
import SidebarNavItem from "@/components/shared/sidebar-nav-item";
import SidebarUtilities from "@/components/shared/sidebar-utilities";
import { useAuthStore } from "@/features/auth/stores/auth-store";

const sidebarGroupClassName =
  "p-0 px-4 group-data-[collapsible=icon]:px-3 not-first:mt-5";

function SidebarNavGroups({ groups }: { groups: NavigationGroup[] }) {
  return groups.map((group) => (
    <SidebarGroup key={group.label} className={sidebarGroupClassName}>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5">
          {group.items.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

export default function AppSidebar() {
  const permissions = useAuthStore((state) => state.permissions);
  const workspaceGroups = groupNavigationItems(
    getNavigationForPermissions(permissions),
  );
  const platformGroups = groupNavigationItems(
    getPlatformNavigationForPermissions(permissions),
  );
  return (
    <TooltipProvider delay={200}>
      <Sidebar collapsible="icon" className="border-sidebar-border">
        <SidebarHeader className="flex h-[72px] shrink-0 flex-row items-center border-b border-sidebar-border p-0 px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-3">
          <SidebarBrand />
        </SidebarHeader>

        <nav
          aria-label="Navigation principale"
          className="flex min-h-0 flex-1 flex-col"
        >
          <SidebarContent className="gap-0 py-4">
            <SidebarNavGroups groups={workspaceGroups} />
            <SidebarNavGroups groups={platformGroups} />
          </SidebarContent>
        </nav>

        <SidebarUtilities />
      </Sidebar>
    </TooltipProvider>
  );
}
