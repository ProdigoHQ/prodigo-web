import { ComponentType } from "react";

export type ModuleKey =
  | "auth"
  | "company"
  | "crm"
  | "inventory"
  | "sales"
  | "invoicing"
  | "payments"
  | "pos"
  | "hr"
  | "ecommerce"
  | "projects"
  | "reporting"
  | "notification";

export interface ModuleNavItem {
  id: string;
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  permissions?: string[];
  order?: number;
  children?: ModuleNavItem[];
  badge?: () => React.ReactNode;
}

export interface ModuleRoute {
  path: string;
  component: ComponentType<any>;
  permissions?: string[];
  exact?: boolean;
}

export interface ModuleWidget {
  id: string;
  component: ComponentType<any>;
}

export interface ModuleManifest {
  key: ModuleKey;
  name: string;
  description?: string;
  version: string;
  icon?: ComponentType<{ className?: string }>;
  requiredPermissions?: string[];
  navItems: ModuleNavItem[];
  routes?: ModuleRoute[];
  widgets?: ModuleWidget[];
  dependencies?: ModuleKey[];
  enabledByDefault?: boolean;
}
