import { notFound } from "next/navigation";
import ModulePlaceholder from "@/features/dashboard/components/module-placeholder";
import { PLATFORM_NAVIGATION } from "@/components/shared/navigation";

export function generateStaticParams() {
  return PLATFORM_NAVIGATION.map((item) => ({
    section: item.href.replace(/^\/admin\//, ""),
  }));
}

export default async function AdminSectionPage({
  params,
}: PageProps<"/admin/[section]">) {
  const { section } = await params;
  const item = PLATFORM_NAVIGATION.find(
    (navigationItem) => navigationItem.href === `/admin/${section}`,
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
