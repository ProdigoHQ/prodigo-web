"use client";

import { useEffect } from "react";
import { moduleRegistry } from "@/core/registry/module-registry";
import { crmManifest } from "@/modules/crm/manifest";
import { inventoryManifest } from "@/modules/inventory/manifest";
import { salesManifest } from "@/modules/sales/manifest";
import { invoicingManifest } from "@/modules/invoicing/manifest";
import { dashboardManifest } from "@/modules/dashboard/manifest";

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!moduleRegistry.get("dashboard")) moduleRegistry.register(dashboardManifest);
    if (!moduleRegistry.get("crm")) moduleRegistry.register(crmManifest);
    if (!moduleRegistry.get("inventory")) moduleRegistry.register(inventoryManifest);
    if (!moduleRegistry.get("sales")) moduleRegistry.register(salesManifest);
    if (!moduleRegistry.get("invoicing")) moduleRegistry.register(invoicingManifest);
  }, []);

  return <>{children}</>;
}
