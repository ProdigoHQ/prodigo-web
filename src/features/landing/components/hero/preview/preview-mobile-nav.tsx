"use client";

import { cn } from "@/lib/utils";
import { PREVIEW_SECTIONS } from "./sections";
import type { PreviewSectionId } from "./types";

type PreviewMobileNavProps = {
  activeSection: PreviewSectionId;
  onSelect: (section: PreviewSectionId) => void;
};

export default function PreviewMobileNav({
  activeSection,
  onSelect,
}: PreviewMobileNavProps) {
  return (
    <nav
      aria-label="Navigation de l’aperçu produit"
      className="shrink-0 border-b border-gray-200 bg-white md:hidden"
    >
      <div className="hide-scrollbar flex gap-1 overflow-x-auto px-2 py-2">
        {PREVIEW_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = section.id === activeSection;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-[10px] font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
              )}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden="true" />
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
