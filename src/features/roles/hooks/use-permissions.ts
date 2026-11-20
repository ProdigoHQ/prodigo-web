"use client";

import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "@/features/roles/api/roles-api";

export const permissionsQueryKey = ["platform-permissions"] as const;

/** Catalog of every platform permission, used by the permissions editor. */
export function usePermissionsQuery() {
  return useQuery({
    queryKey: permissionsQueryKey,
    queryFn: rolesApi.listPermissions,
  });
}
