"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import SidebarBrand from "@/components/shared/sidebar-brand";
import SidebarNavItem from "@/components/shared/sidebar-nav-item";
import SidebarUtilities from "@/components/shared/sidebar-utilities";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { moduleRegistry } from "@/core/registry/module-registry";

export default function AppSidebar() {
  const permissions = useAuthStore((state) => state.permissions);
  const enabledModules = useAuthStore((state) => state.enabledModules);

  // Use module registry when enabledModules available; fallback to permission-based nav
  const registryNav = moduleRegistry.getNav(enabledModules ?? [], permissions ?? []);
  const navItems =
    registryNav.length > 0
      ? registryNav.map((item) => ({
          label: item.label,
          href: item.href,
          icon: item.icon!,
          description: "",
          permissions: item.permissions ?? [],
        }))
      : [];

  // If registry has no items (e.g. not bootstrapped or no enabled modules), keep empty
  // to avoid mixing legacy nav - dashboard can be added via module later
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
            <SidebarGroup className="p-0 px-4 group-data-[collapsible=icon]:px-3">
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {navItems.map((item) => (
                    <SidebarNavItem key={item.href} item={item as any} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </nav>

        <SidebarUtilities />
      </Sidebar>
    </TooltipProvider>
  );
}
