import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusTone } from "./types";

export function PreviewPanel({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

type PreviewPageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PreviewPageHeader({
  title,
  description,
  actions,
}: PreviewPageHeaderProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold tracking-[-0.01em] text-gray-900 sm:text-lg">
          {title}
        </h2>
        <p className="mt-0.5 truncate text-[11px] text-gray-500 sm:text-xs">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

type PreviewActionProps = {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "outline";
  className?: string;
};

export function PreviewAction({
  children,
  icon: Icon,
  variant = "outline",
  className,
}: PreviewActionProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center justify-center gap-1.5 rounded-md border px-2.5 text-[10px] font-medium whitespace-nowrap sm:h-8 sm:text-[11px]",
        variant === "primary"
          ? "border-primary bg-primary text-white"
          : "border-gray-200 bg-white text-gray-600",
        className,
      )}
    >
      {Icon ? <Icon className="size-3 shrink-0" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

type StatTone = "primary" | "navy" | "success" | "warning";

const STAT_TONES: Record<StatTone, string> = {
  primary: "bg-primary-light text-primary",
  navy: "bg-navy-light text-navy",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

type PreviewStatCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone?: StatTone;
  detailTone?: "success" | "muted" | "warning" | "error";
  className?: string;
};

export function PreviewStatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "primary",
  detailTone = "success",
  className,
}: PreviewStatCardProps) {
  const detailClass =
    detailTone === "warning"
      ? "text-warning"
      : detailTone === "error"
        ? "text-error"
        : detailTone === "muted"
          ? "text-gray-400"
          : "text-success";

  return (
    <PreviewPanel className={cn("p-3 sm:p-3.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[10px] font-medium text-gray-400">
          {label}
        </p>
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md",
            STAT_TONES[tone],
          )}
        >
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-1.5 truncate text-[13px] font-semibold text-gray-900 tabular-nums sm:text-sm">
        {value}
      </p>
      {detail ? (
        <p
          className={cn(
            "mt-0.5 truncate text-[10px] font-medium",
            detailClass,
          )}
        >
          {detail}
        </p>
      ) : null}
    </PreviewPanel>
  );
}

const STATUS_TONES: Record<StatusTone, string> = {
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  error: "border-error/20 bg-error/10 text-error",
  neutral: "border-gray-200 bg-gray-50 text-gray-500",
  info: "border-navy/10 bg-navy-light text-navy",
};

type PreviewStatusBadgeProps = {
  tone: StatusTone;
  children: ReactNode;
  className?: string;
};

export function PreviewStatusBadge({
  tone,
  children,
  className,
}: PreviewStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-4 gap-1 px-1.5 text-[9px] font-medium sm:h-5 sm:px-2 sm:text-[10px]",
        STATUS_TONES[tone],
        className,
      )}
    >
      <span
        className="hidden size-1.5 shrink-0 rounded-full bg-current sm:block"
        aria-hidden="true"
      />
      {children}
    </Badge>
  );
}

type PreviewProgressProps = {
  value: number;
  tone?: "primary" | "navy" | "success" | "warning" | "error";
  className?: string;
};

const PROGRESS_TONES = {
  primary: "bg-primary",
  navy: "bg-navy",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

export function PreviewProgress({
  value,
  tone = "primary",
  className,
}: PreviewProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-gray-100",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      <div
        className={cn("h-full rounded-full", PROGRESS_TONES[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

type PreviewSearchProps = {
  placeholder?: string;
  className?: string;
};

export function PreviewSearch({
  placeholder = "Rechercher…",
  className,
}: PreviewSearchProps) {
  return (
    <div
      className={cn(
        "flex h-8 min-w-0 items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 text-[10px] text-gray-400 sm:text-[11px]",
        className,
      )}
    >
      <Search className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate">{placeholder}</span>
      <kbd className="ml-auto hidden rounded border border-gray-200 bg-gray-50 px-1 text-[9px] font-medium text-gray-400 sm:inline">
        ⌘ K
      </kbd>
    </div>
  );
}

type PreviewTableProps = {
  title?: ReactNode;
  action?: ReactNode;
  head: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PreviewTable({
  title,
  action,
  head,
  footer,
  children,
  className,
}: PreviewTableProps) {
  return (
    <PreviewPanel className={cn("overflow-hidden", className)}>
      {title ? (
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-3.5 py-2.5 sm:px-4">
          <div className="min-w-0">{title}</div>
          {action ? (
            <div className="shrink-0 text-[9px] font-medium text-primary sm:text-[10px]">
              {action}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="hide-scrollbar overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>{head}</thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {footer ? (
        <div className="border-t border-gray-100 px-3.5 py-2.5 text-[9px] text-gray-400 sm:px-4 sm:text-[10px]">
          {footer}
        </div>
      ) : null}
    </PreviewPanel>
  );
}

export function PreviewTh({
  className,
  ...props
}: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "border-b border-gray-100 bg-gray-50/80 px-2 py-2 text-[9px] font-semibold tracking-[0.04em] text-gray-400 uppercase sm:px-4 sm:text-[10px]",
        className,
      )}
      {...props}
    />
  );
}

export function PreviewTd({
  className,
  ...props
}: ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "border-t border-gray-100 px-2 py-2 text-[10px] text-gray-600 sm:px-4 sm:py-2 sm:text-[11px]",
        className,
      )}
      {...props}
    />
  );
}

type PreviewAvatarProps = {
  initials: string;
  tone?: "primary" | "navy" | "success" | "neutral";
  className?: string;
};

const AVATAR_TONES = {
  primary: "bg-primary-light text-primary",
  navy: "bg-navy-light text-navy",
  success: "bg-success/10 text-success",
  neutral: "bg-gray-100 text-gray-500",
};

export function PreviewAvatar({
  initials,
  tone = "neutral",
  className,
}: PreviewAvatarProps) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md text-[8px] font-semibold",
        AVATAR_TONES[tone],
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
