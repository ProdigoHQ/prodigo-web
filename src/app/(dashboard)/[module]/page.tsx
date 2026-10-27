import { notFound } from "next/navigation";
import ModulePlaceholder from "@/modules/dashboard/adapters/in/ui/module-placeholder";
import {
  getStaticModuleRoute,
  STATIC_MODULE_ROUTES,
} from "@/core/navigation/static-routes";

export function generateStaticParams() {
  return STATIC_MODULE_ROUTES.map((route) => ({
    module: route.module,
  }));
}

export default async function ModulePage({
  params,
}: PageProps<"/[module]">) {
  const { module } = await params;
  const item = getStaticModuleRoute(module);

  if (!item) notFound();

  return (
    <ModulePlaceholder
      title={item.label}
      description={item.description}
      icon={undefined}
    />
  );
}
