"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import RoleIcon from "@/features/roles/components/role-icon";
import RolePermissionsList from "@/features/roles/components/role-permissions-list";
import { useRoleDetailsQuery } from "@/features/roles/hooks/use-role-details";
import { formatDate, formatTime } from "@/lib/format";

type RoleDetailsSheetProps = {
  roleId: string | null;
  onOpenChange: (open: boolean) => void;
};

function DetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <div className="flex items-start gap-4">
        <Skeleton className="size-12 rounded-xl" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-10 w-full" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function RoleDetailsSheet({
  roleId,
  onOpenChange,
}: RoleDetailsSheetProps) {
  const { data: role, isPending } = useRoleDetailsQuery(roleId);
  const [copiedRoleId, setCopiedRoleId] = useState<string | null>(null);

  const copied = role !== null && role !== undefined && copiedRoleId === role.id;

  async function handleCopyId() {
    if (!role) return;
    try {
      await navigator.clipboard.writeText(role.id);
      setCopiedRoleId(role.id);
    } catch {
      // Clipboard access can be denied by the browser; nothing to recover.
    }
  }

  return (
    <Sheet open={roleId !== null} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:w-[70vw] data-[side=right]:sm:max-w-[680px]"
      >
        <SheetHeader className="border-b border-gray-200 px-6 py-5">
          <SheetTitle className="text-base font-semibold text-gray-900">
            Détails du rôle
          </SheetTitle>
          <SheetDescription className="sr-only">
            Informations et permissions du rôle sélectionné.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {isPending || !role ? (
            <DetailsSkeleton />
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-light text-navy">
                  <RoleIcon roleName={role.name} className="size-6" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {role.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {role.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Informations
                </h3>
                <dl className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="shrink-0 text-gray-500">ID</dt>
                    <dd className="flex min-w-0 items-center gap-1">
                      <span
                        className="truncate font-mono text-xs text-gray-700"
                        title={role.id}
                      >
                        {role.id}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0"
                        title="Copier l'identifiant"
                        aria-label={
                          copied ? "Identifiant copié" : "Copier l'identifiant"
                        }
                        onClick={handleCopyId}
                      >
                        {copied ? <Check /> : <Copy />}
                      </Button>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Créé le</dt>
                    <dd className="text-gray-900">
                      {formatDate(role.createdAt)} · {formatTime(role.createdAt)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Nombre de permissions</dt>
                    <dd className="font-medium text-gray-900">
                      {role.permissions.length}
                    </dd>
                  </div>
                </dl>
                <span role="status" className="sr-only">
                  {copied ? "Identifiant copié" : ""}
                </span>
              </div>

              <RolePermissionsList permissions={role.permissions} />
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
