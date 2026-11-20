import { httpClient } from "@/lib/http/client";
import type { Permission, Role } from "@/features/roles/types";
import type {
  CreateRoleInput,
  UpdateRoleInput,
} from "@/features/roles/schemas/role-schema";

export const rolesApi = {
  /**
   * Platform roles. The backend intentionally leaves `permissions` empty here;
   * role details are fetched separately with `getById`.
   */
  async list(): Promise<Role[]> {
    const { data } = await httpClient.get<Role[]>("/s/admin/roles");
    return data;
  },

  /** Platform role with its full permission list. */
  async getById(roleId: string): Promise<Role> {
    const { data } = await httpClient.get<Role>(
      `/s/admin/roles/${encodeURIComponent(roleId)}`,
    );
    return data;
  },

  /** Catalog of every platform permission. */
  async listPermissions(): Promise<Permission[]> {
    const { data } = await httpClient.get<Permission[]>("/s/admin/permissions");
    return data;
  },

  /**
   * Replaces the role's permission set with the given ids (sync semantics:
   * grants the checked ones, revokes the unchecked ones).
   */
  async syncPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    await httpClient.patch(`/s/admin/roles/${encodeURIComponent(roleId)}`, {
      permissionIds,
    });
  },

  /**
   * Creates a platform role. The backend returns the created role (with zero
   * permissions); permissions are assigned afterwards via `syncPermissions`.
   */
  async create(input: CreateRoleInput): Promise<Role> {
    const { data } = await httpClient.post<Role>("/s/admin/roles", {
      name: input.name,
      description: input.description,
    });
    return data;
  },

  /** Updates the editable role fields (name, description). */
  async update(roleId: string, input: UpdateRoleInput): Promise<void> {
    await httpClient.put(`/s/admin/roles/${encodeURIComponent(roleId)}`, {
      name: input.name,
      description: input.description,
    });
  },

  /** Permanently deletes a platform role. */
  async remove(roleId: string): Promise<void> {
    await httpClient.delete(`/s/admin/roles/${encodeURIComponent(roleId)}`);
  },
};

