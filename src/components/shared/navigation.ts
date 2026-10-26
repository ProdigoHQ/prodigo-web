import type { LucideIcon } from "lucide-react";
import {
  FileText,
  LayoutDashboard,
  Monitor,
  Package,
  Settings,
  ShoppingCart,
  Target,
  UserRoundCog,
  UsersRound,
  Warehouse,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

/**
 * Single source of truth for the workspace navigation.
 * Used by the sidebar and by the temporary module placeholder pages.
 */
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Vue d'ensemble de votre activité.",
  },
  {
    label: "Clients",
    href: "/clients",
    icon: UsersRound,
    description: "Gérez vos clients et leurs informations.",
  },
  {
    label: "Pipeline",
    href: "/pipeline",
    icon: Target,
    description: "Suivez vos opportunités commerciales.",
  },
  {
    label: "Produits",
    href: "/produits",
    icon: Package,
    description: "Gérez votre catalogue de produits.",
  },
  {
    label: "Commandes",
    href: "/commandes",
    icon: ShoppingCart,
    description: "Suivez et traitez les commandes clients.",
  },
  {
    label: "Factures",
    href: "/factures",
    icon: FileText,
    description: "Créez et suivez vos factures.",
  },
  {
    label: "Stock",
    href: "/stock",
    icon: Warehouse,
    description: "Surveillez vos niveaux de stock.",
  },
  {
    label: "Employés",
    href: "/employes",
    icon: UserRoundCog,
    description: "Gérez vos employés et leurs rôles.",
  },
  {
    label: "Caisse (POS)",
    href: "/caisse",
    icon: Monitor,
    description: "Encaissez les ventes au comptoir.",
  },
  {
    label: "Paramètres",
    href: "/parametres",
    icon: Settings,
    description: "Configurez votre espace de travail.",
  },
];

export function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
