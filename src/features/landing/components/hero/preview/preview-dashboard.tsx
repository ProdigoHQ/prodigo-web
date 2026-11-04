import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Download,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RevenueAreaChart } from "./charts";
import {
  PreviewAction,
  PreviewAvatar,
  PreviewPageHeader,
  PreviewPanel,
  PreviewProgress,
  PreviewStatCard,
  PreviewStatusBadge,
  PreviewTable,
  PreviewTd,
  PreviewTh,
} from "./shared";
import type { StatusTone } from "./types";

type Kpi = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "primary" | "navy" | "success" | "warning";
};

const KPIS: Kpi[] = [
  {
    label: "Chiffre d’affaires",
    value: "12 480 000 FCFA",
    detail: "+12,5 % vs octobre",
    icon: Wallet,
    tone: "primary",
  },
  {
    label: "Commandes",
    value: "348",
    detail: "+8,2 % ce mois",
    icon: ShoppingCart,
    tone: "navy",
  },
  {
    label: "Clients actifs",
    value: "1 284",
    detail: "+15 ce mois",
    icon: Users,
    tone: "success",
  },
  {
    label: "Valeur du stock",
    value: "8 750 000 FCFA",
    detail: "+4,1 % vs octobre",
    icon: Package,
    tone: "warning",
  },
];

const REVENUE_VALUES = [
  7.2, 7.8, 7.4, 8.6, 9.1, 8.8, 9.7, 10.2, 9.8, 11.1, 11.7, 12.48,
];

const PREVIOUS_YEAR_VALUES = [
  6.1, 6.5, 6.2, 7.0, 7.4, 7.1, 7.9, 8.1, 7.8, 8.6, 8.9, 9.4,
];

const MONTHS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

type Sale = {
  order: string;
  client: string;
  initials: string;
  date: string;
  amount: string;
  status: string;
  tone: StatusTone;
  avatarTone: "primary" | "navy" | "success" | "neutral";
};

const RECENT_SALES: Sale[] = [
  {
    order: "CMD-2048",
    client: "Boutique Baobab",
    initials: "BB",
    date: "12 nov.",
    amount: "450 000 FCFA",
    status: "Payée",
    tone: "success",
    avatarTone: "primary",
  },
  {
    order: "CMD-2047",
    client: "Kheops Distribution",
    initials: "KD",
    date: "12 nov.",
    amount: "1 250 000 FCFA",
    status: "Attente",
    tone: "warning",
    avatarTone: "navy",
  },
  {
    order: "CMD-2046",
    client: "Sahel Market",
    initials: "SM",
    date: "11 nov.",
    amount: "96 000 FCFA",
    status: "Livrée",
    tone: "success",
    avatarTone: "success",
  },
  {
    order: "CMD-2045",
    client: "Lagune Services",
    initials: "LS",
    date: "11 nov.",
    amount: "320 000 FCFA",
    status: "Préparation",
    tone: "info",
    avatarTone: "neutral",
  },
];

const ACTIVITY = [
  {
    title: "Paiement reçu",
    meta: "Boutique Baobab · 450 000 FCFA",
    time: "5 min",
    icon: CheckCircle2,
    tone: "bg-success/10 text-success",
  },
  {
    title: "Nouvelle commande",
    meta: "Kheops Distribution · 3 articles",
    time: "18 min",
    icon: Clock3,
    tone: "bg-navy-light text-navy",
  },
  {
    title: "Stock faible",
    meta: "Ciment 50 kg · 9 sacs restants",
    time: "1 h",
    icon: AlertTriangle,
    tone: "bg-warning/10 text-warning",
  },
];

function RevenueCard() {
  return (
    <PreviewPanel className="flex min-w-0 flex-col p-3 sm:p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-gray-400 sm:text-[11px]">
            Revenus mensuels
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-lg font-semibold tracking-[-0.01em] text-gray-900 tabular-nums sm:text-xl">
              12 480 000{" "}
              <span className="text-[10px] font-normal text-gray-400">
                FCFA
              </span>
            </p>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-success">
              <TrendingUp className="size-3" aria-hidden="true" />
              +12,5 %
            </span>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-3 text-[9px] text-gray-400 sm:flex">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-3 rounded-full bg-primary" />
            2026
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-3 rounded-full bg-gray-300" />
            2025
          </span>
        </div>
      </div>

      <div className="mt-3 flex-1">
        <RevenueAreaChart
          values={REVENUE_VALUES}
          previousYear={PREVIOUS_YEAR_VALUES}
          labels={MONTHS}
        />
      </div>
    </PreviewPanel>
  );
}

function ObjectiveCard() {
  return (
    <PreviewPanel className="hidden min-w-0 flex-col p-3 lg:flex">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium text-gray-400">
            Objectif du mois
          </p>
          <p className="mt-1 text-lg font-semibold tracking-[-0.01em] text-gray-900 tabular-nums">
            9 720 000{" "}
            <span className="text-[10px] font-normal text-gray-400">
              FCFA
            </span>
          </p>
        </div>
        <span className="rounded-full bg-primary-light px-2 py-0.5 text-[9px] font-semibold text-primary">
          78 %
        </span>
      </div>
      <p className="mt-0.5 text-[9px] text-gray-400">
        sur 12 500 000 FCFA
      </p>
      <PreviewProgress value={78} className="mt-2" />

      <div className="mt-2.5 border-t border-gray-100 pt-2">
        <p className="text-[9px] font-semibold tracking-[0.08em] text-gray-400 uppercase">
          Activité récente
        </p>
        <ul className="mt-2 space-y-1.5">
          {ACTIVITY.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.title} className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                    item.tone,
                  )}
                >
                  <Icon className="size-3" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="truncate text-[9px] text-gray-400">
                    {item.meta}
                  </p>
                </div>
                <span className="shrink-0 text-[8px] text-gray-300">
                  {item.time}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </PreviewPanel>
  );
}

function RecentSalesTable() {
  return (
    <PreviewTable
      title={
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-semibold text-gray-800 sm:text-xs">
            Dernières ventes
          </p>
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[8px] font-medium text-gray-500">
            4
          </span>
        </div>
      }
      action={
        <span className="inline-flex items-center gap-1">
          Tout voir
          <ArrowUpRight className="size-2.5" aria-hidden="true" />
        </span>
      }
      head={
        <tr>
          <PreviewTh>Client</PreviewTh>
          <PreviewTh className="hidden sm:table-cell">Date</PreviewTh>
          <PreviewTh className="text-right">Montant</PreviewTh>
          <PreviewTh className="text-right">Statut</PreviewTh>
        </tr>
      }
    >
      {RECENT_SALES.map((sale) => (
        <tr
          key={sale.order}
          className="transition-colors hover:bg-gray-50/70"
        >
          <PreviewTd>
            <div className="flex items-center gap-2">
              <PreviewAvatar
                initials={sale.initials}
                tone={sale.avatarTone}
                className="hidden sm:flex"
              />
              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium text-gray-900 sm:text-[11px]">
                  {sale.client}
                </p>
                <p className="text-[8px] text-gray-400 sm:text-[9px]">
                  {sale.order}
                </p>
              </div>
            </div>
          </PreviewTd>
          <PreviewTd className="hidden text-gray-400 sm:table-cell">
            {sale.date}
          </PreviewTd>
          <PreviewTd className="text-right font-medium whitespace-nowrap text-gray-800 tabular-nums">
            {sale.amount}
          </PreviewTd>
          <PreviewTd className="text-right">
            <PreviewStatusBadge tone={sale.tone}>
              {sale.status}
            </PreviewStatusBadge>
          </PreviewTd>
        </tr>
      ))}
    </PreviewTable>
  );
}

export default function PreviewDashboard() {
  return (
    <div className="space-y-2.5">
      <PreviewPageHeader
        title="Tableau de bord"
        description="Vue d’ensemble de votre activité — Novembre 2026"
        actions={
          <>
            <PreviewAction
              icon={Download}
              className="hidden sm:inline-flex"
            >
              Télécharger
            </PreviewAction>
            <PreviewAction icon={Plus} variant="primary">
              Nouvelle vente
            </PreviewAction>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <PreviewStatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            detail={kpi.detail}
            icon={kpi.icon}
            tone={kpi.tone}
          />
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <RevenueCard />
        <ObjectiveCard />
      </div>

      <RecentSalesTable />
    </div>
  );
}
