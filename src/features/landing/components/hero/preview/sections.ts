import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Package,
  UsersRound,
  Warehouse,
} from "lucide-react";
import type { PreviewSection } from "./types";

export const PREVIEW_SECTIONS: PreviewSection[] = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    slug: "dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "customers",
    label: "Clients",
    slug: "clients",
    icon: UsersRound,
  },
  {
    id: "products",
    label: "Produits",
    slug: "produits",
    icon: Package,
  },
  {
    id: "inventory",
    label: "Stock",
    slug: "stock",
    icon: Warehouse,
  },
  {
    id: "invoices",
    label: "Factures",
    slug: "factures",
    icon: FileText,
  },
  {
    id: "reports",
    label: "Rapports",
    slug: "rapports",
    icon: BarChart3,
  },
];
