"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "@/features/roles/api/roles-api";
import { rolesQueryKey } from "@/features/roles/hooks/use-roles";

type SyncRolePermissionsVariables = {
  roleId: string;
  permissionIds: string[];
};

export function useSyncRolePermissionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: SyncRolePermissionsVariables) =>
      rolesApi.syncPermissions(roleId, permissionIds),
    onSuccess: (_data, { roleId }) => {
      // Refresh the cached role detail so the new permission set is served
      // everywhere it is read (details sheet, reopened editor).
      queryClient.invalidateQueries({ queryKey: [...rolesQueryKey, roleId] });
    },
  });
}
