"use client";

import {
  ChevronDown,
  HelpCircle,
  MoreHorizontal,
} from "lucide-react";
import Logo from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { PREVIEW_SECTIONS } from "./sections";
import type { PreviewSectionId } from "./types";

type PreviewSidebarProps = {
  activeSection: PreviewSectionId;
  onSelect: (section: PreviewSectionId) => void;
};

export default function PreviewSidebar({
  activeSection,
  onSelect,
}: PreviewSidebarProps) {
  return (
    <aside className="hidden w-[208px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex lg:w-[232px]">
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4">
        <Logo variant="dark" />
      </div>

      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-white/[0.04] px-2 py-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-[9px] font-semibold text-white">
            PG
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-semibold text-white">
              Prodigo Global
            </span>
            <span className="block truncate text-[9px] text-sidebar-foreground">
              Plan Business
            </span>
          </span>
          <ChevronDown
            className="size-3 shrink-0 text-sidebar-foreground"
            aria-hidden="true"
          />
        </div>
      </div>

      <nav
        aria-label="Modules de l’aperçu produit"
        className="min-h-0 flex-1 px-3 py-4"
      >
        <p className="px-2.5 pb-2 text-[9px] font-semibold tracking-[0.14em] text-sidebar-foreground/60 uppercase">
          Gestion
        </p>
        <ul className="space-y-1">
          {PREVIEW_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === activeSection;

            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => onSelect(section.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-[11px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{section.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 flex items-center gap-2 px-1.5 py-1.5">
          <HelpCircle
            className="size-3.5 text-sidebar-foreground"
            aria-hidden="true"
          />
          <span className="text-[10px] font-medium text-sidebar-foreground">
            Aide &amp; support
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] p-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-white">
            AD
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[10px] font-semibold text-white">
              Amadou Diallo
            </span>
            <span className="block truncate text-[9px] text-sidebar-foreground">
              Administrateur
            </span>
          </span>
          <MoreHorizontal
            className="size-3.5 shrink-0 text-sidebar-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
    </aside>
  );
}
