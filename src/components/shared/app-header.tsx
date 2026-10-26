"use client";

import { Building2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export default function AppHeader() {
  const tenantSlug = useAuthStore((state) => state.tenantSlug);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 md:px-6">
      <SidebarTrigger
        className="-ml-1 text-gray-600 md:hidden"
        aria-label="Ouvrir le menu de navigation"
      />

      <div className="flex min-w-0 items-center gap-2">
        <Building2 className="size-4 shrink-0 text-gray-400" aria-hidden="true" />
        <span className="truncate text-sm font-medium text-gray-700">
          {tenantSlug || "Espace de travail"}
        </span>
      </div>

      <span className="ml-auto hidden text-xs text-gray-500 sm:inline">
        Prodigo ERP
      </span>
    </header>
  );
}
