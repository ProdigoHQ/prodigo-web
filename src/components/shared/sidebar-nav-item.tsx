"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  isNavigationItemActive,
  type NavigationItem,
} from "@/components/shared/navigation";

export const sidebarItemClassName =
  "h-11 gap-3.5 rounded-[10px] px-3.5 text-[15px] font-medium text-sidebar-foreground transition-colors duration-200 motion-reduce:transition-none [&_svg]:size-5 hover:bg-sidebar-accent hover:text-white focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar data-active:bg-sidebar-primary data-active:text-white data-active:shadow-[0_2px_8px_rgba(15,23,42,0.2)] data-active:hover:bg-sidebar-primary group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5!";

type SidebarNavItemProps = {
  item: NavigationItem;
};

export default function SidebarNavItem({ item }: SidebarNavItemProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const Icon = item.icon;
  const isActive = isNavigationItemActive(pathname, item.href);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={
          <Link
            href={item.href}
            aria-current={isActive ? "page" : undefined}
          />
        }
        isActive={isActive}
        tooltip={item.label}
        aria-label={item.label}
        className={sidebarItemClassName}
        onClick={() => {
          if (isMobile) setOpenMobile(false);
        }}
      >
        <Icon aria-hidden="true" />
        <span className="truncate group-data-[collapsible=icon]:hidden">
          {item.label}
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
