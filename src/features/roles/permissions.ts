/** Platform role permission codes (`ERP.*` namespace). */
export const ROLE_PERMISSIONS = {
  CREATE: "ERP.ROLE.CREATE",
  READ: "ERP.ROLE.READ",
  UPDATE: "ERP.ROLE.UPDATE",
  DELETE: "ERP.ROLE.DELETE",
} as const;

/**
 * Codes required to sync the permissions attached to a role. The backend
 * endpoint accepts either, so the UI gate mirrors that with an OR.
 */
export const ROLE_PERMISSION_SYNC = {
  ASSIGN: "ERP.PERMISSION.ASSIGN",
  REVOKE: "ERP.PERMISSION.REVOKE",
} as const;

