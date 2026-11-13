import type { Metadata } from "next";
import RolesPage from "@/features/roles/components/roles-page";

export const metadata: Metadata = {
  title: "Rôles | Prodigo ERP",
  description: "Gérez les rôles et leurs permissions.",
};

export default function AdminRolesPage() {
  return <RolesPage />;
}
