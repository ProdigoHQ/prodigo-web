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
  /**
   * Permission codes that grant access to this item.
   *
   * Codes follow the backend convention `<MODULE>.<RESOURCE>.<ACTION>`.
   * The item is visible when the user owns at least one listed permission,
   * or the module-level `<MODULE>.MODULE.CRUD` full-access permission.
   * An empty list makes the item available to every authenticated user.
   */
  permissions: string[];
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
    permissions: [],
  },
  {
    label: "Clients",
    href: "/clients",
    icon: UsersRound,
    description: "Gérez vos clients et leurs informations.",
    permissions: ["CRM.CUSTOMER.READ", "CRM.MODULE.CRUD"],
  },
  {
    label: "Pipeline",
    href: "/pipeline",
    icon: Target,
    description: "Suivez vos opportunités commerciales.",
    permissions: ["CRM.OPPORTUNITY.READ", "CRM.MODULE.CRUD"],
  },
  {
    label: "Produits",
    href: "/produits",
    icon: Package,
    description: "Gérez votre catalogue de produits.",
    permissions: ["INVENTORY.PRODUCT.READ", "INVENTORY.MODULE.CRUD"],
  },
  {
    label: "Commandes",
    href: "/commandes",
    icon: ShoppingCart,
    description: "Suivez et traitez les commandes clients.",
    permissions: ["SALES.ORDER.READ", "SALES.MODULE.CRUD"],
  },
  {
    label: "Factures",
    href: "/factures",
    icon: FileText,
    description: "Créez et suivez vos factures.",
    permissions: ["INVOICING.INVOICE.READ", "INVOICING.MODULE.CRUD"],
  },
  {
    label: "Stock",
    href: "/stock",
    icon: Warehouse,
    description: "Surveillez vos niveaux de stock.",
    permissions: ["INVENTORY.STOCK.READ", "INVENTORY.MODULE.CRUD"],
  },
  {
    label: "Employés",
    href: "/employes",
    icon: UserRoundCog,
    description: "Gérez vos employés et leurs rôles.",
    permissions: ["HR.EMPLOYEE.READ", "HR.MODULE.CRUD"],
  },
  {
    label: "Caisse (POS)",
    href: "/caisse",
    icon: Monitor,
    description: "Encaissez les ventes au comptoir.",
    permissions: ["POS.SALE.READ", "POS.MODULE.CRUD"],
  },
  {
    label: "Paramètres",
    href: "/parametres",
    icon: Settings,
    description: "Configurez votre espace de travail.",
    // Personal/workspace settings are available to every authenticated user
    // until the backend exposes a dedicated settings permission.
    permissions: [],
  },
];

export function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function hasNavigationPermission(
  permissions: readonly string[],
  requiredPermission: string,
) {
  if (permissions.includes(requiredPermission)) return true;

  // `<MODULE>.MODULE.CRUD` is the backend's full-access permission for a
  // subscribed module, so it grants every resource-level action in that module.
  const [moduleKey] = requiredPermission.split(".");
  return permissions.includes(`${moduleKey}.MODULE.CRUD`);
}

export function canAccessNavigationItem(
  item: NavigationItem,
  permissions: readonly string[],
) {
  if (item.permissions.length === 0) return true;

  return item.permissions.some((permission) =>
    hasNavigationPermission(permissions, permission),
  );
}

/**
 * Filters the workspace navigation down to the items the current user may
 * access. The backend remains the source of truth for authorization; this
 * only keeps inaccessible destinations out of the UI.
 */
export function getNavigationForPermissions(permissions: readonly string[]) {
  return MAIN_NAVIGATION.filter((item) =>
    canAccessNavigationItem(item, permissions),
  );
}
