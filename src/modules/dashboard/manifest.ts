import { LayoutDashboard } from "lucide-react";
import { ModuleManifest } from "@/core/registry/module-manifest";

export const dashboardManifest: ModuleManifest = {
  key: "company", // dashboard is core, but keep minimal manifest for registry
  name: "Tableau de bord",
  description: "Vue d'ensemble de votre activité.",
  version: "1.0.0",
  icon: LayoutDashboard,
  requiredPermissions: [],
  navItems: [
    {
      id: "dashboard",
      label: "Tableau de bord",
      href: "/dashboard",
      icon: LayoutDashboard,
      permissions: [],
      order: 1,
    },
  ],
  routes: [],
  widgets: [],
};
