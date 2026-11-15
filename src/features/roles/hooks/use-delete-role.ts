"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "@/features/roles/api/roles-api";
import { rolesQueryKey } from "@/features/roles/hooks/use-roles";

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => rolesApi.remove(roleId),
    onSuccess: (_data, roleId) => {
      // Drop the detail entry so a deleted role is never re-rendered from cache.
      queryClient.removeQueries({ queryKey: [...rolesQueryKey, roleId] });
      queryClient.invalidateQueries({ queryKey: rolesQueryKey });
    },
  });
}
