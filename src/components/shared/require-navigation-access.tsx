"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  canAccessNavigationItem,
  findNavigationItemForPath,
} from "@/components/shared/navigation";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export default function RequireNavigationAccess({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const permissions = useAuthStore((state) => state.permissions);
  const item = findNavigationItemForPath(pathname);

  // Routes that are not part of the navigation are left to their own handling
  // (e.g. notFound). The backend remains the source of truth for data access.
  if (item && !canAccessNavigationItem(item, permissions)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
          <Lock className="size-6" aria-hidden="true" />
        </div>
        <div className="max-w-md space-y-1">
          <h1 className="text-lg font-semibold text-gray-900">Accès refusé</h1>
          <p className="text-sm text-gray-500">
            Vous n&apos;avez pas les permissions nécessaires pour accéder à
            cette page. Contactez un administrateur de votre espace de
            travail.
          </p>
        </div>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
