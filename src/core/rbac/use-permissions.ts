"use client";

import { useAuthStore } from "@/modules/auth/stores/auth-store";

export function usePermissions() {
  const roles = useAuthStore((s) => s.roles);
  const permissions = useAuthStore((s) => s.permissions);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const hasPermission = (perm: string | string[]): boolean => {
    if (!permissions?.length) return false;
    if (Array.isArray(perm)) {
      return perm.some((p) => permissions.includes(p));
    }
    return permissions.includes(perm);
  };

  const hasAllPermissions = (perms: string[]): boolean => {
    if (!permissions?.length) return false;
    return perms.every((p) => permissions.includes(p));
  };

  const hasAnyPermission = (perms: string[]): boolean => {
    if (!permissions?.length) return false;
    return perms.some((p) => permissions.includes(p));
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!roles?.length) return false;
    if (Array.isArray(role)) {
      return role.some((r) => roles.includes(r));
    }
    return roles.includes(role);
  };

  const hasAnyRole = (...roleList: string[]): boolean => {
    if (!roles?.length) return false;
    return roleList.some((r) => roles.includes(r));
  };

  const isPlatformAdmin = (): boolean => {
    if (!permissions?.length) return false;
    return permissions.some((p) => p.startsWith("ERP."));
  };

  const isErpPermission = (p: string): boolean => p.startsWith("ERP.");

  const getModuleFromPermission = (p: string): string => {
    if (p.startsWith("ERP.")) return "platform";
    const parts = p.split(".");
    return parts[0] || "unknown";
  };

  return {
    roles,
    permissions,
    isAuthenticated,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    isPlatformAdmin,
    isErpPermission,
    getModuleFromPermission,
  };
}
