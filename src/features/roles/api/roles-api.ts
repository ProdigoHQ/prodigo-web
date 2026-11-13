import { ROLES_STATIC_DATA } from "@/features/roles/api/roles-static-data";
import type { Role } from "@/features/roles/types";

export const rolesApi = {
  // Static until the backend roles endpoints are connected. Replace the bodies
  // with typed httpClient calls once the routes are confirmed.
  async list(): Promise<Role[]> {
    return [...ROLES_STATIC_DATA];
  },

  async getById(roleId: string): Promise<Role | null> {
    return ROLES_STATIC_DATA.find((role) => role.id === roleId) ?? null;
  },
};
