import { notFound } from "next/navigation";
import ModulePlaceholder from "@/features/dashboard/components/module-placeholder";
import { MAIN_NAVIGATION } from "@/components/shared/navigation";

export function generateStaticParams() {
  return MAIN_NAVIGATION.filter((item) => item.href !== "/dashboard").map(
    (item) => ({
      module: item.href.replace(/^\//, ""),
    }),
  );
}

export default async function ModulePage({
  params,
}: PageProps<"/[module]">) {
  const { module } = await params;
  const item = MAIN_NAVIGATION.find(
    (navigationItem) =>
      navigationItem.href === `/${module}` &&
      navigationItem.href !== "/dashboard",
  );

  if (!item) notFound();

  return (
    <ModulePlaceholder
      title={item.label}
      description={item.description}
      icon={item.icon}
    />
  );
}
