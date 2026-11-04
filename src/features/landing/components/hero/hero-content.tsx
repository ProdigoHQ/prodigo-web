import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
  { icon: Globe, label: "Accessible depuis votre navigateur" },
  { icon: Building2, label: "Gestion multi-entreprises" },
  { icon: ShieldCheck, label: "Sécurité et contrôle des accès" },
];

export default function HeroContent() {
  return (
    <div className="relative mx-auto max-w-6xl text-center">
      <div className="flex justify-center">
        <a
          href="#apercu"
          className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pr-3 pl-1 text-[10px] shadow-xs transition-colors duration-200 hover:border-gray-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none sm:text-[11px]"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2 py-0.5 text-[9px] font-semibold tracking-[0.06em] text-primary uppercase">
            <span
              className="size-1.5 rounded-full bg-primary animate-pulse-soft motion-reduce:animate-none"
              aria-hidden="true"
            />
            Nouveau
          </span>
          <span className="font-medium text-gray-600">
            Paiements Mobile Money intégrés
          </span>
          <ArrowRight
            className="size-3 shrink-0 text-gray-400 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </a>
      </div>

      <h1 className="mx-auto mt-6 max-w-6xl text-balance text-[2.125rem] leading-[1.06] font-semibold tracking-[-0.04em] text-gray-900 sm:mt-7 sm:text-5xl sm:leading-[1.04] lg:text-6xl lg:leading-[1.02] xl:text-[4rem]">
        <span className="block">Pilotez toute votre entreprise.</span>
        <span className="mt-1 block text-gray-500 sm:mt-2">
          <span className="lg:whitespace-nowrap">Un seul système.</span>{" "}
          <span className="text-gray-900 lg:whitespace-nowrap">
            Une vision complète.
          </span>
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-pretty text-[15px] leading-7 text-gray-500 sm:mt-6 sm:text-lg sm:leading-8">
        Ventes, clients, stocks, facturation et opérations : centralisez la
        gestion de votre entreprise dans un ERP conçu pour simplifier votre
        quotidien.
      </p>

      <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
        <Link
          href="/register"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 gap-2 rounded-[10px] px-6 text-[15px] font-semibold shadow-sm hover:bg-[var(--color-primary-hover)]",
          )}
        >
          Commencer gratuitement
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="#apercu"
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "h-12 rounded-[10px] border-gray-200 bg-white px-6 text-[15px] font-medium hover:bg-gray-50",
          )}
        >
          Découvrir Prodigo
        </Link>
      </div>

      <ul className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-x-6">
        {TRUST_ITEMS.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 sm:text-xs"
          >
            <item.icon
              className="size-3.5 shrink-0 text-gray-400"
              aria-hidden="true"
            />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
