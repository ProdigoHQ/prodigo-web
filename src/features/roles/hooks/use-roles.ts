"use client";

import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "@/features/roles/api/roles-api";

export const rolesQueryKey = ["roles"] as const;

export function useRolesQuery() {
  return useQuery({
    queryKey: rolesQueryKey,
    queryFn: rolesApi.list,
  });
}
