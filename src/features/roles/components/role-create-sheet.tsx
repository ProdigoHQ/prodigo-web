"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateRoleMutation } from "@/features/roles/hooks/use-create-role";
import {
  createRoleSchema,
  type CreateRoleInput,
} from "@/features/roles/schemas/role-schema";
import type { Role } from "@/features/roles/types";
import { ApiError } from "@/lib/http/api-error";
import { toFieldErrors } from "@/lib/validation";

type RoleCreateSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the role the backend just created. */
  onCreated?: (role: Role) => void;
};

type RoleCreateFormProps = {
  isPending: boolean;
  /** Mutation error, kept untyped so the form decides how to present it. */
  error: unknown;
  onSubmit: (input: CreateRoleInput) => void;
  onCancel: () => void;
};

const labelClassName =
  "mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase";

function RoleCreateForm({
  isPending,
  error,
  onSubmit,
  onCancel,
}: RoleCreateFormProps) {
  const [values, setValues] = useState<CreateRoleInput>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Server-side validation issues are read straight from the mutation error, so
  // they never need to be copied into local state.
  const serverFieldErrors =
    error instanceof ApiError ? error.fieldErrors : undefined;
  const submitError = error
    ? error instanceof ApiError
      ? error.message
      : "Une erreur inattendue est survenue. Veuillez réessayer."
    : null;

  const fieldError = (field: keyof CreateRoleInput) =>
    errors[field] ?? serverFieldErrors?.[field];

  function update(field: keyof CreateRoleInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = createRoleSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    onSubmit(parsed.data);
  }

  const nameError = fieldError("name");
  const descriptionError = fieldError("description");

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-0 flex-1 flex-col"
      noValidate
    >
      <SheetHeader className="border-b border-gray-200 px-6 py-5">
        <SheetTitle className="text-base font-semibold text-gray-900">
          Créer un rôle
        </SheetTitle>
        <SheetDescription className="text-sm text-gray-500">
          Définissez le nom et la description du nouveau rôle.
        </SheetDescription>
      </SheetHeader>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-5">
          {submitError && (
            <Alert variant="destructive">
              <AlertTitle>Création impossible</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="new-role-name" className={labelClassName}>
              Nom du rôle
            </Label>
            <Input
              id="new-role-name"
              name="name"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Ex. TenantManager"
              className="h-11 bg-white"
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "new-role-name-error" : undefined}
              autoComplete="off"
              disabled={isPending}
            />
            {nameError ? (
              <p
                id="new-role-name-error"
                className="mt-1.5 text-xs font-medium text-destructive"
              >
                {nameError}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Identifiant lisible du rôle, affiché dans la liste.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="new-role-description" className={labelClassName}>
              Description
            </Label>
            <Input
              id="new-role-description"
              name="description"
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Ex. Gère la création des entreprises et de leurs utilisateurs"
              className="h-11 bg-white"
              aria-invalid={Boolean(descriptionError)}
              aria-describedby={
                descriptionError ? "new-role-description-error" : undefined
              }
              autoComplete="off"
              disabled={isPending}
            />
            {descriptionError ? (
              <p
                id="new-role-description-error"
                className="mt-1.5 text-xs font-medium text-destructive"
              >
                {descriptionError}
              </p>
            ) : null}
          </div>

          <p className="text-xs text-gray-500">
            Le rôle est créé sans permissions. Une fois créé, utilisez
            « Modifier » sur sa ligne pour lui en assigner.
          </p>
        </div>
      </div>

      <SheetFooter className="border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
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
          disabled={isPending || values.name.trim().length === 0}
          aria-busy={isPending}
        >
          {isPending ? (
            <Loader2
              data-icon="inline-start"
              className="animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : null}
          {isPending ? "Création…" : "Créer le rôle"}
        </Button>
      </SheetFooter>
    </form>
  );
}

export default function RoleCreateSheet({
  open,
  onOpenChange,
  onCreated,
}: RoleCreateSheetProps) {
  const createMutation = useCreateRoleMutation();
  const isPending = createMutation.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isPending) return;
    if (!nextOpen) createMutation.reset();
    onOpenChange(nextOpen);
  }

  function handleSubmit(input: CreateRoleInput) {
    createMutation.mutate(input, {
      onSuccess: (createdRole) => {
        createMutation.reset();
        onOpenChange(false);
        onCreated?.(createdRole);
      },
    });
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:w-[70vw] data-[side=right]:sm:max-w-[520px]"
      >
        {open ? (
          <RoleCreateForm
            isPending={isPending}
            error={createMutation.isError ? createMutation.error : null}
            onSubmit={handleSubmit}
            onCancel={() => handleOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
