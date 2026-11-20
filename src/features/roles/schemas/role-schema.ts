import { z } from "zod";

/**
 * Editable fields of a platform role.
 *
 * The backend only accepts name and description here; permissions are managed
 * separately and are out of scope for this form.
 */
export const updateRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom du rôle est requis.")
    .max(100, "100 caractères maximum."),
  description: z
    .string()
    .trim()
    .max(500, "500 caractères maximum.")
    .default(""),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

/**
 * Creation fields. Identical constraints to the edit schema; a new role starts
 * with zero permissions, which are assigned afterwards from the roles list.
 */
export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom du rôle est requis.")
    .max(100, "100 caractères maximum."),
  description: z
    .string()
    .trim()
    .max(500, "500 caractères maximum.")
    .default(""),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
