"use client";

import { useRef, useState, type ComponentType } from "react";
import { LockKeyhole, MousePointerClick } from "lucide-react";
import PreviewCustomers from "./preview/preview-customers";
import PreviewDashboard from "./preview/preview-dashboard";
import PreviewHeader from "./preview/preview-header";
import PreviewInventory from "./preview/preview-inventory";
import PreviewInvoices from "./preview/preview-invoices";
import PreviewMobileNav from "./preview/preview-mobile-nav";
import PreviewProducts from "./preview/preview-products";
import PreviewReports from "./preview/preview-reports";
import PreviewSidebar from "./preview/sidebar";
import { PREVIEW_SECTIONS } from "./preview/sections";
import type { PreviewSectionId } from "./preview/types";

const SECTION_COMPONENTS: Record<PreviewSectionId, ComponentType> = {
  dashboard: PreviewDashboard,
  customers: PreviewCustomers,
  products: PreviewProducts,
  inventory: PreviewInventory,
  invoices: PreviewInvoices,
  reports: PreviewReports,
};

export default function ProductPreview() {
  const [activeSection, setActiveSection] =
    useState<PreviewSectionId>("dashboard");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function handleSectionChange(section: PreviewSectionId) {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    setActiveSection(section);
  }

  const active =
    PREVIEW_SECTIONS.find((section) => section.id === activeSection) ??
    PREVIEW_SECTIONS[0];
  const ActiveSection = SECTION_COMPONENTS[activeSection];

  return (
    <div
      id="apercu"
      className="relative mx-auto mt-10 max-w-[1180px] scroll-mt-28 sm:mt-12 lg:mt-14"
    >
      <div
        role="region"
        aria-label="Aperçu interactif de l’application Prodigo"
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_24px_70px_-30px_rgba(30,45,103,0.4)] sm:rounded-2xl"
      >
        <div className="flex h-10 items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 sm:px-4">
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-gray-300" />
            <span className="size-2.5 rounded-full bg-gray-300" />
            <span className="size-2.5 rounded-full bg-gray-300" />
          </div>

          <div className="flex flex-1 justify-center px-2">
            <div className="flex h-6 w-full min-w-0 max-w-[320px] items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[9px] text-gray-400 shadow-xs sm:h-7 sm:px-3 sm:text-[10px]">
              <LockKeyhole
                className="size-2.5 shrink-0 text-success sm:size-3"
                aria-hidden="true"
              />
              <span className="truncate">
                app.prodigo.com/{active.slug}
              </span>
            </div>
          </div>

          <span className="hidden shrink-0 items-center gap-1 text-[10px] font-medium text-gray-500 lg:flex">
            <MousePointerClick
              className="size-3 text-primary"
              aria-hidden="true"
            />
            Aperçu interactif
          </span>
        </div>

        <div className="flex h-[640px] bg-gray-50 sm:h-[760px]">
          <PreviewSidebar
            activeSection={activeSection}
            onSelect={handleSectionChange}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <PreviewHeader section={active} />
            <PreviewMobileNav
              activeSection={activeSection}
              onSelect={handleSectionChange}
            />

            <div
              ref={scrollContainerRef}
              className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
              tabIndex={0}
              role="region"
              aria-label={`Contenu ${active.label}`}
            >
              <div
                key={activeSection}
                className="animate-in fade-in-0 duration-200 motion-reduce:animate-none"
              >
                <ActiveSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-gray-400 sm:mt-4 sm:text-[11px]">
        <MousePointerClick
          className="size-3.5 shrink-0 text-primary"
          aria-hidden="true"
        />
        Explorez l’aperçu en sélectionnant un module dans la navigation.
      </p>

      <p className="sr-only" aria-live="polite">
        Section {active.label} affichée dans l’aperçu.
      </p>
    </div>
  );
}
