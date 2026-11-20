"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "@/features/roles/api/roles-api";
import { rolesQueryKey } from "@/features/roles/hooks/use-roles";
import type { CreateRoleInput } from "@/features/roles/schemas/role-schema";

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRoleInput) => rolesApi.create(input),
    onSuccess: (createdRole) => {
      // Seed the detail cache with the backend response so the new role is
      // available immediately if its details/permissions are opened.
      queryClient.setQueryData([...rolesQueryKey, createdRole.id], createdRole);
      queryClient.invalidateQueries({ queryKey: rolesQueryKey });
    },
  });
}
