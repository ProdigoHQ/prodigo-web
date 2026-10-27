import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export default function Field({
  label,
  htmlFor,
  error,
  hint,
  right,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <Label
          htmlFor={htmlFor}
          className="text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          {label}
        </Label>
        {right}
      </div>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
