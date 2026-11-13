"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Home, RefreshCw, Search, ShieldQuestion } from "lucide-react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/shared/data-table";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { getRolesColumns } from "@/features/roles/components/roles-columns";
import RoleDetailsSheet from "@/features/roles/components/role-details-sheet";
import { useRolesQuery } from "@/features/roles/hooks/use-roles";
import { ROLE_PERMISSIONS } from "@/features/roles/permissions";
import { ApiError } from "@/lib/http/api-error";

const SEARCHABLE_COLUMN_IDS = ["name", "description"];

export default function RolesPage() {
  const [search, setSearch] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const { data = [], error, isPending, refetch } = useRolesQuery();
  const permissions = useAuthStore((state) => state.permissions);

  const canViewRoles = permissions.includes(ROLE_PERMISSIONS.READ);
  const canUpdateRoles = permissions.includes(ROLE_PERMISSIONS.UPDATE);
  const canDeleteRoles = permissions.includes(ROLE_PERMISSIONS.DELETE);

  const columns = useMemo(
    () =>
      getRolesColumns({
        canView: canViewRoles,
        canUpdate: canUpdateRoles,
        canDelete: canDeleteRoles,
        onView: (role) => setSelectedRoleId(role.id),
      }),
    [canViewRoles, canUpdateRoles, canDeleteRoles],
  );

  const hasSearch = search.trim().length > 0;

  const emptyState = (
    <Empty className="border-0 py-12">
      <EmptyMedia variant="icon">
        <ShieldQuestion aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>
          {hasSearch ? "Aucun rôle trouvé" : "Aucun rôle disponible"}
        </EmptyTitle>
        <EmptyDescription>
          {hasSearch
            ? `Aucun rôle ne correspond à « ${search.trim()} ».`
            : "Les rôles de la plateforme apparaîtront ici."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Link href="/dashboard" />}
                aria-label="Accueil"
                className="flex items-center text-gray-500"
              >
                <Home className="size-4" aria-hidden="true" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-gray-500">Accès &amp; sécurité</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Rôles</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Rôles
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez les rôles et leurs permissions
            </p>
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un rôle..."
              aria-label="Rechercher un rôle"
              className="h-11 bg-white pl-9"
            />
          </div>
        </div>
      </div>

      {error && !isPending && (
        <Alert variant="destructive" className="items-center">
          <AlertTitle>Impossible de charger les rôles</AlertTitle>
          <AlertDescription>
            {error instanceof ApiError
              ? error.message
              : "Une erreur inattendue est survenue. Veuillez réessayer."}
          </AlertDescription>
          <AlertAction>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw data-icon="inline-start" aria-hidden="true" />
              Réessayer
            </Button>
          </AlertAction>
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={data}
        searchableColumnIds={SEARCHABLE_COLUMN_IDS}
        globalFilter={search}
        isLoading={isPending}
        emptyState={emptyState}
        itemLabel={["rôle", "rôles"]}
        getRowId={(role) => role.id}
        selectedRowId={selectedRoleId}
        onRowClick={(role) => setSelectedRoleId(role.id)}
      />

      <RoleDetailsSheet
        roleId={selectedRoleId}
        onOpenChange={(open) => {
          if (!open) setSelectedRoleId(null);
        }}
      />
    </div>
  );
}
