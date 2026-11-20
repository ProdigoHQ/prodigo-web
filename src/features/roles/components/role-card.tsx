"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoleIcon from "@/features/roles/components/role-icon";
import type { Role } from "@/features/roles/types";
import { formatDate } from "@/lib/format";

type RoleCardProps = {
  role: Role;
  /** `ERP.ROLE.READ` */
  canView: boolean;
  /** `ERP.ROLE.UPDATE` */
  canUpdate: boolean;
  /** `ERP.ROLE.DELETE` */
  canDelete: boolean;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
};

/**
 * Mobile card for a role row. Rendered below `md`, where the table would be
 * too dense. Each action only renders when the user holds the matching
 * permission, mirroring the desktop actions column; buttons use 44px touch
 * targets.
 */
export default function RoleCard({
  role,
  canView,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: RoleCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy-light text-navy">
          <RoleIcon roleName={role.name} className="size-4" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-gray-900">{role.name}</h3>
          <p className="text-xs text-gray-500">
            Créé le {formatDate(role.createdAt)}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600">{role.description}</p>

      {canView || canUpdate || canDelete ? (
        <div className="flex flex-wrap gap-2">
          {canView && (
            <Button
              variant="outline"
              className="h-11 flex-1"
              onClick={() => onView(role)}
            >
              <Eye data-icon="inline-start" aria-hidden="true" />
              Voir
            </Button>
          )}
          {canUpdate && (
            <Button
              variant="outline"
              className="h-11 flex-1"
              onClick={() => onEdit(role)}
            >
              <Pencil data-icon="inline-start" aria-hidden="true" />
              Modifier
            </Button>
          )}
          {canDelete && (
            <Button
              variant="outline"
              className="h-11 flex-1 text-gray-500 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(role)}
            >
              <Trash2 data-icon="inline-start" aria-hidden="true" />
              Supprimer
            </Button>
          )}
        </div>
      ) : null}
    </article>
  );
}
