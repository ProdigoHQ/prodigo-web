"use client";

import { usePermissions } from "@/core/rbac/use-permissions";
import { useAuthStore } from "@/modules/auth/stores/auth-store";

interface ModuleGuardProps {
  moduleKey: string;
  requiredPermissions?: string | string[];
  children: React.ReactNode;
}

export function ModuleGuard({
  moduleKey,
  requiredPermissions = [],
  children,
}: ModuleGuardProps) {
  const { hasPermission } = usePermissions();
  const permissions = useAuthStore((s) => s.permissions);

  // Note: enabledModules not yet in store; rely on permissions + route structure
  // This will be enhanced when /me provides enabledModules
  if (requiredPermissions.length > 0) {
    const perms = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];
    if (!perms.some((p) => permissions.includes(p))) {
      return (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
          <h2 className="text-lg font-semibold">Accès refusé</h2>
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder à ce module.
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
