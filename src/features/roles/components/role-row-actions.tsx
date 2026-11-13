"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Role } from "@/features/roles/types";

type RoleRowActionsProps = {
  role: Role;
  /** `ERP.ROLE.READ` */
  canView: boolean;
  /** `ERP.ROLE.UPDATE` */
  canUpdate: boolean;
  /** `ERP.ROLE.DELETE` */
  canDelete: boolean;
  onView: (role: Role) => void;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
};

/**
 * Row actions for the roles table. Each action only renders when the signed-in
 * user holds the matching permission. `onEdit` / `onDelete` are optional until
 * the edit and delete workflows are wired; without a handler the action is
 * shown disabled so the row stays predictable.
 */
export default function RoleRowActions({
  role,
  canView,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: RoleRowActionsProps) {
  if (!canView && !canUpdate && !canDelete) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {canView && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Voir les détails de ${role.name}`}
          title="Voir les détails"
          onClick={() => onView(role)}
        >
          <Eye aria-hidden="true" />
        </Button>
      )}

      {canUpdate && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Modifier ${role.name}`}
          title="Modifier le rôle"
          disabled={!onEdit}
          onClick={() => onEdit?.(role)}
        >
          <Pencil aria-hidden="true" />
        </Button>
      )}

      {canDelete && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-gray-500 hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Supprimer ${role.name}`}
          title="Supprimer le rôle"
          disabled={!onDelete}
          onClick={() => onDelete?.(role)}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
