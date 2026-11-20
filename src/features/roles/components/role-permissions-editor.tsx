"use client";

import { useMemo, useState, type FormEvent } from "react";
import { KeyRound, Loader2, RefreshCw, Search, SearchX } from "lucide-react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import PermissionActionBadge from "@/features/roles/components/permission-action-badge";
import { usePermissionsQuery } from "@/features/roles/hooks/use-permissions";
import { useRoleDetailsQuery } from "@/features/roles/hooks/use-role-details";
import { useSyncRolePermissionsMutation } from "@/features/roles/hooks/use-sync-role-permissions";
import type { Role } from "@/features/roles/types";
import { ApiError } from "@/lib/http/api-error";

type RolePermissionsEditorSheetProps = {
  role: Role | null;
  onOpenChange: (open: boolean) => void;
};

type RolePermissionsEditorFormProps = {
  role: Role;
  /** Permission ids the role currently holds, captured once per open. */
  initialPermissionIds: string[];
  isPending: boolean;
  /** Mutation error, kept untyped so the form decides how to present it. */
  error: unknown;
  onSubmit: (permissionIds: string[]) => void;
  onCancel: () => void;
};

function EditorSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

function pluralize(count: number, singular: string, plural: string) {
  return count > 1 ? plural : singular;
}

function RolePermissionsEditorForm({
  role,
  initialPermissionIds,
  isPending,
  error,
  onSubmit,
  onCancel,
}: RolePermissionsEditorFormProps) {
  const {
    data: allPermissions = [],
    isPending: isLoadingPermissions,
  } = usePermissionsQuery();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(initialPermissionIds),
  );
  const [search, setSearch] = useState("");

  const initialIds = useMemo(
    () => new Set(initialPermissionIds),
    [initialPermissionIds],
  );

  const query = search.trim().toLowerCase();
  const filteredPermissions = useMemo(() => {
    if (!query) return allPermissions;
    return allPermissions.filter(
      (permission) =>
        permission.code.toLowerCase().includes(query) ||
        permission.description.toLowerCase().includes(query),
    );
  }, [allPermissions, query]);

  const addedCount = useMemo(
    () =>
      [...selectedIds].filter((permissionId) => !initialIds.has(permissionId))
        .length,
    [selectedIds, initialIds],
  );
  const removedCount = useMemo(
    () =>
      [...initialIds].filter((permissionId) => !selectedIds.has(permissionId))
        .length,
    [initialIds, selectedIds],
  );
  const isDirty = addedCount > 0 || removedCount > 0;

  const submitError = error
    ? error instanceof ApiError
      ? error.message
      : "Une erreur inattendue est survenue. Veuillez réessayer."
    : null;

  function togglePermission(permissionId: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(permissionId);
      } else {
        next.delete(permissionId);
      }
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit([...selectedIds]);
  }

  const selectedCount = selectedIds.size;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-0 flex-1 flex-col"
      noValidate
    >
      <SheetHeader className="border-b border-gray-200 px-6 py-5">
        <SheetTitle className="text-base font-semibold text-gray-900">
          Permissions du rôle
        </SheetTitle>
        <SheetDescription className="text-sm text-gray-500">
          Cochez ou décochez les permissions de « {role.name} », puis
          enregistrez.
        </SheetDescription>
      </SheetHeader>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-3">
          {submitError && (
            <Alert variant="destructive">
              <AlertTitle>Modification impossible</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Permissions de la plateforme
            </h3>
            <Badge variant="secondary" className="bg-navy-light text-navy">
              {selectedCount} sélectionnée
              {pluralize(selectedCount, "", "s")}
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

          {isLoadingPermissions ? (
            <EditorSkeleton />
          ) : filteredPermissions.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {filteredPermissions.map((permission) => {
                const isChecked = selectedIds.has(permission.id);
                return (
                  <li
                    key={permission.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition-colors hover:bg-gray-50 data-checked:border-primary/40"
                    data-checked={isChecked ? "" : undefined}
                  >
                    <div className="flex min-w-0 items-start gap-2.5">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          togglePermission(permission.id, checked)
                        }
                        disabled={isPending}
                        className="mt-0.5"
                        aria-label={`Permission ${permission.code}`}
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
                );
              })}
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
                    : "Aucune permission n'est disponible sur la plateforme."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </div>

      <SheetFooter className="border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-between">
        <p className="text-xs text-gray-500 sm:py-1.5">
          {isDirty
            ? `${addedCount} ${pluralize(addedCount, "ajoutée", "ajoutées")} · ${removedCount} ${pluralize(removedCount, "retirée", "retirées")}`
            : "Aucune modification"}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isPending || !isDirty}
            aria-busy={isPending}
          >
            {isPending ? (
              <Loader2
                data-icon="inline-start"
                className="animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <KeyRound data-icon="inline-start" aria-hidden="true" />
            )}
            {isPending ? "Mise à jour…" : "Mettre à jour les permissions"}
          </Button>
        </div>
      </SheetFooter>
    </form>
  );
}

export default function RolePermissionsEditorSheet({
  role,
  onOpenChange,
}: RolePermissionsEditorSheetProps) {
  const syncMutation = useSyncRolePermissionsMutation();
  const isPending = syncMutation.isPending;

  const {
    data: roleDetails,
    error: detailsError,
    isError: isDetailsError,
    refetch: refetchDetails,
  } = useRoleDetailsQuery(role?.id ?? null);

  function handleOpenChange(open: boolean) {
    if (!open && isPending) return;
    if (!open) syncMutation.reset();
    onOpenChange(open);
  }

  function handleSubmit(permissionIds: string[]) {
    if (!role) return;

    syncMutation.mutate(
      { roleId: role.id, permissionIds },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Sheet open={role !== null} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:w-[70vw] data-[side=right]:sm:max-w-[680px]"
      >
        {isDetailsError ? (
          <div className="px-6 py-5">
            <Alert variant="destructive">
              <AlertTitle>Impossible de charger le rôle</AlertTitle>
              <AlertDescription>
                {detailsError instanceof ApiError
                  ? detailsError.message
                  : "Une erreur inattendue est survenue. Veuillez réessayer."}
              </AlertDescription>
              <AlertAction>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchDetails()}
                >
                  <RefreshCw data-icon="inline-start" aria-hidden="true" />
                  Réessayer
                </Button>
              </AlertAction>
            </Alert>
          </div>
        ) : role && roleDetails ? (
          <RolePermissionsEditorForm
            key={role.id}
            role={role}
            initialPermissionIds={roleDetails.permissions.map(
              (permission) => permission.id,
            )}
            isPending={isPending}
            error={syncMutation.isError ? syncMutation.error : null}
            onSubmit={handleSubmit}
            onCancel={() => handleOpenChange(false)}
          />
        ) : (
          <div className="px-6 py-5">
            <EditorSkeleton />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
