import { ReceiptText } from "lucide-react";
import { ModuleManifest } from "@/core/registry/module-manifest";

export const invoicingManifest: ModuleManifest = {
  key: "invoicing",
  name: "Facturation",
  description: "Factures, avoirs et paiements",
  version: "1.0.0",
  icon: ReceiptText,
  dependencies: ["company", "sales"],
  requiredPermissions: ["invoicing.invoice.read"],
  navItems: [
    {
      id: "invoicing-invoices",
      label: "Factures",
      href: "/invoicing/invoices",
      icon: ReceiptText,
      permissions: ["invoicing.invoice.read"],
      order: 10,
    },
  ],
  routes: [],
  widgets: [],
};
