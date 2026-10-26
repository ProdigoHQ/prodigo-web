import { Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "light" | "dark";
  size?: "default" | "lg";
  className?: string;
  nameClassName?: string;
};

export default function Logo({
  variant = "light",
  size = "default",
  className,
  nameClassName,
}: LogoProps) {
  const isLarge = size === "lg";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        variant === "light" && "mb-10",
        className,
      )}
    >
      <div
        className={cn(
          "auth-logo__mark flex shrink-0 items-center justify-center rounded-xl",
          isLarge ? "h-[42px] w-[42px]" : "h-9 w-9",
        )}
      >
        <Hexagon
          className={cn("text-white", isLarge ? "h-6 w-6" : "h-5 w-5")}
          strokeWidth={2.5}
        />
      </div>
      <span
        className={cn(
          "font-bold tracking-tight",
          isLarge ? "text-2xl" : "text-xl",
          variant === "dark" ? "text-white" : "auth-logo__name",
          nameClassName,
        )}
      >
        Prodigo
      </span>
    </div>
  );
}
