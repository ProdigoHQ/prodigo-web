import { crmManifest } from "@/modules/crm/manifest";
import { inventoryManifest } from "@/modules/inventory/manifest";
import { salesManifest } from "@/modules/sales/manifest";
import { invoicingManifest } from "@/modules/invoicing/manifest";
import { dashboardManifest } from "@/modules/dashboard/manifest";

export interface StaticModuleRoute {
  module: string;
  href: string;
  label: string;
  description: string;
}

const navItems = [
  ...crmManifest.navItems,
  ...inventoryManifest.navItems,
  ...salesManifest.navItems,
  ...invoicingManifest.navItems,
];

export const STATIC_MODULE_ROUTES: StaticModuleRoute[] = navItems
  .filter((item) => item.href !== "/dashboard")
  .map((item) => ({
    module: item.href.replace(/^\//, ""),
    href: item.href,
    label: item.label,
    description: "",
  }));

export function getStaticModuleRoute(module: string): StaticModuleRoute | undefined {
  return STATIC_MODULE_ROUTES.find((route) => route.module === module);
}
