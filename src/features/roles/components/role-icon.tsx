import { Eye, Shield, ShieldCheck, Users } from "lucide-react";

type RoleIconProps = {
  roleName: string;
  className?: string;
};

/**
 * Role icon by role name. Switches on the name instead of selecting a
 * component reference so the icon stays static across renders.
 */
export default function RoleIcon({ roleName, className }: RoleIconProps) {
  switch (roleName) {
    case "SUPER_ADMIN":
      return (
        <ShieldCheck className={className} aria-hidden="true" />
      );
    case "PLATFORM_ADMIN":
      return <Users className={className} aria-hidden="true" />;
    case "PLATFORM_AUDITOR":
      return <Eye className={className} aria-hidden="true" />;
    default:
      return <Shield className={className} aria-hidden="true" />;
  }
}
