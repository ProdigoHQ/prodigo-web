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
import { MAIN_NAVIGATION } from "@/components/shared/navigation";
import SidebarBrand from "@/components/shared/sidebar-brand";
import SidebarNavItem from "@/components/shared/sidebar-nav-item";
import SidebarUtilities from "@/components/shared/sidebar-utilities";

export default function AppSidebar() {
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
                  {MAIN_NAVIGATION.map((item) => (
                    <SidebarNavItem key={item.href} item={item} />
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
