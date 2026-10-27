import { Package } from "lucide-react";
import { ModuleManifest } from "@/core/registry/module-manifest";

export const inventoryManifest: ModuleManifest = {
  key: "inventory",
  name: "Inventaire",
  description: "Produits, stock, entrepôts et mouvements",
  version: "1.0.0",
  icon: Package,
  dependencies: ["company"],
  requiredPermissions: ["inventory.product.read"],
  navItems: [
    {
      id: "inventory-products",
      label: "Produits",
      href: "/inventory/products",
      icon: Package,
      permissions: ["inventory.product.read"],
      order: 10,
    },
    {
      id: "inventory-stock",
      label: "Stock",
      href: "/inventory/stock",
      permissions: ["inventory.stock.read"],
      order: 20,
    },
    {
      id: "inventory-warehouses",
      label: "Entrepôts",
      href: "/inventory/warehouses",
      permissions: ["inventory.warehouse.read"],
      order: 30,
    },
  ],
  routes: [],
  widgets: [],
};
