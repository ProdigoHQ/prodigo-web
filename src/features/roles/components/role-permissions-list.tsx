"use client";

import { useMemo, useState } from "react";
import { KeyRound, Search, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import PermissionActionBadge from "@/features/roles/components/permission-action-badge";
import type { Permission } from "@/features/roles/types";

type RolePermissionsListProps = {
  permissions: Permission[];
  isLoading?: boolean;
};

export default function RolePermissionsList({
  permissions,
  isLoading = false,
}: RolePermissionsListProps) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredPermissions = useMemo(() => {
    if (!query) return permissions;
    return permissions.filter(
      (permission) =>
        permission.code.toLowerCase().includes(query) ||
        permission.description.toLowerCase().includes(query),
    );
  }, [permissions, query]);

  return (
    <section
      aria-labelledby="role-permissions-heading"
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between gap-3">
        <h3
          id="role-permissions-heading"
          className="text-sm font-semibold text-gray-900"
        >
          Permissions
        </h3>
        <Badge variant="secondary" className="bg-navy-light text-navy">
          {permissions.length} permission{permissions.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une permission..."
          aria-label="Rechercher une permission"
          className="h-10 pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredPermissions.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {filteredPermissions.map((permission) => (
            <li
              key={permission.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2.5"
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <KeyRound
                  className="mt-0.5 size-4 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs font-medium text-gray-900">
                    {permission.code}
                  </p>
                  <p className="text-xs text-gray-500">
                    {permission.description}
                  </p>
                </div>
              </div>
              <PermissionActionBadge action={permission.action} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty className="border-0 py-8">
          <EmptyMedia variant="icon">
            <SearchX aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>
              {query ? "Aucune permission trouvée" : "Aucune permission"}
            </EmptyTitle>
            <EmptyDescription>
              {query
                ? `Aucune permission ne correspond à « ${search.trim()} ».`
                : "Ce rôle ne possède aucune permission pour le moment."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  );
}
