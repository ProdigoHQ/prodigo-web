import Logo from "@/components/shared/logo";

export default function SidebarBrand() {
  return (
    <Logo
      variant="dark"
      size="lg"
      className="gap-3 group-data-[collapsible=icon]:gap-0"
      nameClassName="group-data-[collapsible=icon]:hidden"
    />
  );
}
