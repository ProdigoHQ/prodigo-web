"use client";

import { Loader2, Trash2 } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteRoleMutation } from "@/features/roles/hooks/use-delete-role";
import type { Role } from "@/features/roles/types";
import { ApiError } from "@/lib/http/api-error";

type RoleDeleteDialogProps = {
  role: Role | null;
  onOpenChange: (open: boolean) => void;
  /** Called after the backend confirms the deletion. */
  onDeleted?: (role: Role) => void;
};

export default function RoleDeleteDialog({
  role,
  onOpenChange,
  onDeleted,
}: RoleDeleteDialogProps) {
  const deleteMutation = useDeleteRoleMutation();
  const isPending = deleteMutation.isPending;

  function handleOpenChange(open: boolean) {
    if (!open && isPending) return;
    if (!open) deleteMutation.reset();
    onOpenChange(open);
  }

  function handleDelete() {
    if (!role) return;

    deleteMutation.mutate(role.id, {
      onSuccess: () => {
        const deletedRole = role;
        deleteMutation.reset();
        onOpenChange(false);
        onDeleted?.(deletedRole);
      },
    });
  }

  const errorMessage = deleteMutation.isError
    ? deleteMutation.error instanceof ApiError
      ? deleteMutation.error.message
      : "Une erreur inattendue est survenue. Veuillez réessayer."
    : null;

  return (
    <AlertDialog open={role !== null} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Supprimer ce rôle ?</AlertDialogTitle>
          <AlertDialogDescription>
            Le rôle{" "}
            <span className="font-medium text-gray-900">{role?.name}</span> sera
            définitivement supprimé. Les utilisateurs qui le possèdent perdront
            les permissions associées. Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Suppression impossible</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (
              <Loader2
                data-icon="inline-start"
                className="animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <Trash2 data-icon="inline-start" aria-hidden="true" />
            )}
            {isPending ? "Suppression…" : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
