import { Users } from "lucide-react";
import { ModuleManifest } from "@/core/registry/module-manifest";

export const crmManifest: ModuleManifest = {
  key: "crm",
  name: "CRM",
  description: "Gérer les clients, prospects et pipeline",
  version: "1.0.0",
  icon: Users,
  dependencies: ["company"],
  requiredPermissions: ["crm.customer.read"],
  navItems: [
    {
      id: "crm-customers",
      label: "Clients",
      href: "/crm/customers",
      icon: Users,
      permissions: ["crm.customer.read"],
      order: 10,
    },
    {
      id: "crm-leads",
      label: "Prospects",
      href: "/crm/leads",
      permissions: ["crm.lead.read"],
      order: 20,
    },
  ],
  routes: [],
  widgets: [],
};
