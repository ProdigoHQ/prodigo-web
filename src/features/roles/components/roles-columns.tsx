import type { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/shared/data-table-column-header";
import RoleIcon from "@/features/roles/components/role-icon";
import RoleRowActions from "@/features/roles/components/role-row-actions";
import type { Role } from "@/features/roles/types";
import { formatDate, formatTime } from "@/lib/format";

type RoleNameCellProps = {
  role: Role;
};

function RoleNameCell({ role }: RoleNameCellProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy-light text-navy">
        <RoleIcon roleName={role.name} className="size-4" />
      </span>
      <span className="font-semibold text-gray-900">{role.name}</span>
    </div>
  );
}

const baseColumns: ColumnDef<Role, unknown>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom du rôle" />
    ),
    cell: ({ row }) => <RoleNameCell role={row.original} />,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.description}</span>
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Créé le" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-gray-900">{formatDate(row.original.createdAt)}</span>
        <span className="text-xs text-gray-500">
          {formatTime(row.original.createdAt)}
        </span>
      </div>
    ),
    enableGlobalFilter: false,
    sortingFn: "datetime",
  },
];

export type RolesColumnsOptions = {
  /** `ERP.ROLE.READ` — shows the "Voir" action. */
  canView: boolean;
  /** `ERP.ROLE.UPDATE` — shows the "Modifier" action. */
  canUpdate: boolean;
  /** `ERP.ROLE.DELETE` — shows the "Supprimer" action. */
  canDelete: boolean;
  onView: (role: Role) => void;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
};

/**
 * Role table columns. The actions column is appended only when the user holds
 * at least one role permission, and each button is gated individually inside
 * `RoleRowActions`.
 */
export function getRolesColumns({
  canView,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: RolesColumnsOptions): ColumnDef<Role, unknown>[] {
  if (!canView && !canUpdate && !canDelete) {
    return baseColumns;
  }

  return [
    ...baseColumns,
    {
      id: "actions",
      header: () => <span className="block text-right">Actions</span>,
      cell: ({ row }) => (
        <div
          className="flex items-center justify-end"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <RoleRowActions
            role={row.original}
            canView={canView}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ),
      enableSorting: false,
      enableGlobalFilter: false,
    },
  ];
}
