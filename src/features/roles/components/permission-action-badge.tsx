import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ACTION_STYLES: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700",
  ACTIVATE: "bg-emerald-50 text-emerald-700",
  ASSIGN: "bg-emerald-50 text-emerald-700",
  READ: "bg-blue-50 text-blue-700",
  UPDATE: "bg-orange-50 text-orange-700",
  DELETE: "bg-red-50 text-red-700",
  REVOKE: "bg-red-50 text-red-700",
  SUSPEND: "bg-red-50 text-red-700",
  DEACTIVATE: "bg-red-50 text-red-700",
};

function getActionStyle(action: string) {
  if (ACTION_STYLES[action]) return ACTION_STYLES[action];
  // READ_USERS, READ_USAGE, READ_RISK_EVENTS, ... share the read color.
  if (action.startsWith("READ")) return ACTION_STYLES.READ;
  return "bg-gray-100 text-gray-600";
}

export default function PermissionActionBadge({ action }: { action: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("shrink-0 font-medium", getActionStyle(action))}
    >
      {action}
    </Badge>
  );
}
