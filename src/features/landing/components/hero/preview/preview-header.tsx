import {
  Bell,
  ChevronRight,
  Hexagon,
  Search,
} from "lucide-react";
import type { PreviewSection } from "./types";

type PreviewHeaderProps = {
  section: PreviewSection;
};

export default function PreviewHeader({ section }: PreviewHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-5">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary md:hidden">
        <Hexagon
          className="size-3.5 text-white"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </span>

      <div className="flex min-w-0 items-center gap-1.5 text-[11px] sm:text-xs">
        <span className="hidden text-gray-400 sm:inline">
          Prodigo Global
        </span>
        <ChevronRight
          className="hidden size-3 shrink-0 text-gray-300 sm:inline"
          aria-hidden="true"
        />
        <span className="truncate font-medium text-gray-700">
          {section.label}
        </span>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2.5">
        <div className="hidden h-8 w-44 items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2.5 text-[11px] text-gray-400 sm:flex lg:w-52">
          <Search className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Rechercher…</span>
          <kbd className="ml-auto rounded border border-gray-200 bg-white px-1 text-[9px] font-medium text-gray-400">
            ⌘ K
          </kbd>
        </div>

        <span className="relative flex size-8 items-center justify-center rounded-md text-gray-500">
          <Bell className="size-4" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
        </span>

        <span className="hidden h-5 w-px bg-gray-200 sm:block" />

        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-[9px] font-semibold text-white">
          AD
        </span>
        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-[11px] font-medium text-gray-800">
            Amadou D.
          </p>
          <p className="truncate text-[9px] text-gray-400">
            Administrateur
          </p>
        </div>
      </div>
    </header>
  );
}
