import { ShoppingCart } from "lucide-react";
import { ModuleManifest } from "@/core/registry/module-manifest";

export const salesManifest: ModuleManifest = {
  key: "sales",
  name: "Ventes",
  description: "Devis, commandes et ventes",
  version: "1.0.0",
  icon: ShoppingCart,
  dependencies: ["company", "inventory", "crm"],
  requiredPermissions: ["sales.order.read"],
  navItems: [
    {
      id: "sales-quotes",
      label: "Devis",
      href: "/sales/quotes",
      permissions: ["sales.quote.read"],
      order: 10,
    },
    {
      id: "sales-orders",
      label: "Commandes",
      href: "/sales/orders",
      permissions: ["sales.order.read"],
      order: 20,
    },
  ],
  routes: [],
  widgets: [],
};
