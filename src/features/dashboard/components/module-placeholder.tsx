import type { LucideIcon } from "lucide-react";

type ModulePlaceholderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function ModulePlaceholder({
  title,
  description,
  icon: Icon,
}: ModulePlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <div className="max-w-md space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Module en cours de construction
          </h2>
          <p className="text-sm text-gray-500">
            Cette section sera bientôt disponible dans votre espace de travail.
          </p>
        </div>
      </div>
    </div>
  );
}
