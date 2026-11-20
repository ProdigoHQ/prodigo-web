"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "@/features/roles/api/roles-api";
import { rolesQueryKey } from "@/features/roles/hooks/use-roles";
import type { UpdateRoleInput } from "@/features/roles/schemas/role-schema";

type UpdateRoleVariables = {
  roleId: string;
  input: UpdateRoleInput;
};

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, input }: UpdateRoleVariables) =>
      rolesApi.update(roleId, input),
    onSuccess: () => {
      // Prefix match: refreshes the list and every cached role detail.
      queryClient.invalidateQueries({ queryKey: rolesQueryKey });
    },
  });
}
