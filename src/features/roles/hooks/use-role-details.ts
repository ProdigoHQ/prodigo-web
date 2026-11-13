"use client";

import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "@/features/roles/api/roles-api";
import { rolesQueryKey } from "@/features/roles/hooks/use-roles";

export function useRoleDetailsQuery(roleId: string | null) {
  return useQuery({
    queryKey: [...rolesQueryKey, roleId],
    queryFn: () => {
      if (!roleId) {
        throw new Error("Missing role id");
      }
      return rolesApi.getById(roleId);
    },
    enabled: roleId !== null,
  });
}
