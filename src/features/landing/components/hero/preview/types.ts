import type { LucideIcon } from "lucide-react";

export type PreviewSectionId =
  | "dashboard"
  | "customers"
  | "products"
  | "inventory"
  | "invoices"
  | "reports";

export type PreviewSection = {
  id: PreviewSectionId;
  label: string;
  slug: string;
  icon: LucideIcon;
};

export type StatusTone = "success" | "warning" | "error" | "neutral" | "info";
