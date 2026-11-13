import { httpClient } from "@/lib/http/client";
import type { Role } from "@/features/roles/types";

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
};
