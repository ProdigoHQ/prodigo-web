import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Building2,
  Boxes,
  CreditCard,
  FileText,
  KeyRound,
  LayoutDashboard,
  Monitor,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Target,
  UserRoundCog,
  UsersRound,
  Warehouse,
} from "lucide-react";

export const NAVIGATION_CATEGORY = {
  overview: "Vue d'ensemble",
  sales: "Ventes & clients",
  operations: "Opérations",
  people: "Ressources humaines",
  workspace: "Espace de travail",
  accounts: "Comptes",
  access: "Accès & sécurité",
  platform: "Plateforme",
} as const;

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  /** Sidebar section the item belongs to. Items sharing a category are grouped together. */
  category: string;
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

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
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
    category: NAVIGATION_CATEGORY.overview,
    permissions: [],
  },
  {
    label: "Clients",
    href: "/clients",
    icon: UsersRound,
    description: "Gérez vos clients et leurs informations.",
    category: NAVIGATION_CATEGORY.sales,
    permissions: ["CRM.CUSTOMER.READ", "CRM.MODULE.CRUD"],
  },
  {
    label: "Pipeline",
    href: "/pipeline",
    icon: Target,
    description: "Suivez vos opportunités commerciales.",
    category: NAVIGATION_CATEGORY.sales,
    permissions: ["CRM.OPPORTUNITY.READ", "CRM.MODULE.CRUD"],
  },
  {
    label: "Commandes",
    href: "/commandes",
    icon: ShoppingCart,
    description: "Suivez et traitez les commandes clients.",
    category: NAVIGATION_CATEGORY.sales,
    permissions: ["SALES.ORDER.READ", "SALES.MODULE.CRUD"],
  },
  {
    label: "Factures",
    href: "/factures",
    icon: FileText,
    description: "Créez et suivez vos factures.",
    category: NAVIGATION_CATEGORY.sales,
    permissions: ["INVOICING.INVOICE.READ", "INVOICING.MODULE.CRUD"],
  },
  {
    label: "Produits",
    href: "/produits",
    icon: Package,
    description: "Gérez votre catalogue de produits.",
    category: NAVIGATION_CATEGORY.operations,
    permissions: ["INVENTORY.PRODUCT.READ", "INVENTORY.MODULE.CRUD"],
  },
  {
    label: "Stock",
    href: "/stock",
    icon: Warehouse,
    description: "Surveillez vos niveaux de stock.",
    category: NAVIGATION_CATEGORY.operations,
    permissions: ["INVENTORY.STOCK.READ", "INVENTORY.MODULE.CRUD"],
  },
  {
    label: "Caisse (POS)",
    href: "/caisse",
    icon: Monitor,
    description: "Encaissez les ventes au comptoir.",
    category: NAVIGATION_CATEGORY.operations,
    permissions: ["POS.SALE.READ", "POS.MODULE.CRUD"],
  },
  {
    label: "Employés",
    href: "/employes",
    icon: UserRoundCog,
    description: "Gérez vos employés et leurs rôles.",
    category: NAVIGATION_CATEGORY.people,
    permissions: ["HR.EMPLOYEE.READ", "HR.MODULE.CRUD"],
  },
  {
    label: "Paramètres",
    href: "/parametres",
    icon: Settings,
    description: "Configurez votre espace de travail.",
    category: NAVIGATION_CATEGORY.workspace,
    // Personal/workspace settings are available to every authenticated user
    // until the backend exposes a dedicated settings permission.
    permissions: [],
  },
];

/**
 * Platform administration navigation. Platform permissions are the global
 * `ERP.<RESOURCE>.<ACTION>` codes and are never tenant-scoped.
 */
export const PLATFORM_NAVIGATION: NavigationItem[] = [
  {
    label: "Entreprises",
    href: "/admin/tenants",
    icon: Building2,
    description: "Gérez les espaces de travail des entreprises.",
    category: NAVIGATION_CATEGORY.accounts,
    permissions: ["ERP.TENANT.READ"],
  },
  {
    label: "Utilisateurs",
    href: "/admin/users",
    icon: UsersRound,
    description: "Gérez les comptes de la plateforme.",
    category: NAVIGATION_CATEGORY.accounts,
    permissions: ["ERP.USER.READ"],
  },
  {
    label: "Rôles",
    href: "/admin/roles",
    icon: ShieldCheck,
    description: "Définissez les rôles de la plateforme.",
    category: NAVIGATION_CATEGORY.access,
    permissions: ["ERP.ROLE.READ"],
  },
  {
    label: "Permissions",
    href: "/admin/permissions",
    icon: KeyRound,
    description: "Consultez les permissions disponibles.",
    category: NAVIGATION_CATEGORY.access,
    permissions: ["ERP.PERMISSION.READ"],
  },
  {
    label: "Modules",
    href: "/admin/modules",
    icon: Boxes,
    description: "Gérez les modules ERP et leur disponibilité.",
    category: NAVIGATION_CATEGORY.platform,
    permissions: ["ERP.MODULE.READ"],
  },
  {
    label: "Abonnements",
    href: "/admin/subscriptions",
    icon: CreditCard,
    description: "Suivez les abonnements aux modules.",
    category: NAVIGATION_CATEGORY.platform,
    permissions: ["ERP.SUBSCRIPTION.READ", "ERP.BILLING.READ"],
  },
  {
    label: "Système",
    href: "/admin/system",
    icon: Activity,
    description: "Supervisez l'état et les journaux de la plateforme.",
    category: NAVIGATION_CATEGORY.platform,
    permissions: ["ERP.SYSTEM.READ", "ERP.SYSTEM.MONITOR", "ERP.SYSTEM.LOGS"],
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

export function getPlatformNavigationForPermissions(
  permissions: readonly string[],
) {
  return PLATFORM_NAVIGATION.filter((item) =>
    canAccessNavigationItem(item, permissions),
  );
}

/**
 * Groups items by category, keeping the order in which each category first
 * appears. Empty categories are never returned.
 */
export function groupNavigationItems(
  items: readonly NavigationItem[],
): NavigationGroup[] {
  const groups: NavigationGroup[] = [];

  for (const item of items) {
    const group = groups.find((candidate) => candidate.label === item.category);
    if (group) {
      group.items.push(item);
    } else {
      groups.push({ label: item.category, items: [item] });
    }
  }

  return groups;
}
