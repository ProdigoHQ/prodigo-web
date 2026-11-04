import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import {
  PreviewAction,
  PreviewAvatar,
  PreviewPageHeader,
  PreviewSearch,
  PreviewStatCard,
  PreviewStatusBadge,
  PreviewTable,
  PreviewTd,
  PreviewTh,
} from "./shared";
import type { StatusTone } from "./types";

type Customer = {
  name: string;
  initials: string;
  segment: string;
  lastOrder: string;
  total: string;
  status: string;
  tone: StatusTone;
  avatarTone: "primary" | "navy" | "success" | "neutral";
};

const CUSTOMERS: Customer[] = [
  {
    name: "Boutique Baobab",
    initials: "BB",
    segment: "Retail",
    lastOrder: "12 nov. 2026",
    total: "2 450 000 FCFA",
    status: "Actif",
    tone: "success",
    avatarTone: "primary",
  },
  {
    name: "Kheops Distribution",
    initials: "KD",
    segment: "Grossiste",
    lastOrder: "10 nov. 2026",
    total: "8 120 000 FCFA",
    status: "Actif",
    tone: "success",
    avatarTone: "navy",
  },
  {
    name: "Maya Coiffure",
    initials: "MC",
    segment: "Services",
    lastOrder: "08 nov. 2026",
    total: "780 000 FCFA",
    status: "Actif",
    tone: "success",
    avatarTone: "success",
  },
  {
    name: "Sahel Market",
    initials: "SM",
    segment: "Retail",
    lastOrder: "05 nov. 2026",
    total: "1 320 000 FCFA",
    status: "À relancer",
    tone: "warning",
    avatarTone: "neutral",
  },
  {
    name: "Lagune Services",
    initials: "LS",
    segment: "Entreprise",
    lastOrder: "02 nov. 2026",
    total: "3 940 000 FCFA",
    status: "Actif",
    tone: "success",
    avatarTone: "navy",
  },
  {
    name: "Atelier Kola",
    initials: "AK",
    segment: "Services",
    lastOrder: "30 oct. 2026",
    total: "1 120 000 FCFA",
    status: "Actif",
    tone: "success",
    avatarTone: "primary",
  },
  {
    name: "Ndiaye & Fils",
    initials: "NF",
    segment: "Grossiste",
    lastOrder: "28 oct. 2026",
    total: "5 640 000 FCFA",
    status: "Actif",
    tone: "success",
    avatarTone: "navy",
  },
];

export default function PreviewCustomers() {
  return (
    <div className="space-y-3">
      <PreviewPageHeader
        title="Clients"
        description="Gérez votre portefeuille client et suivez les encaissements."
        actions={
          <>
            <PreviewAction
              icon={Download}
              className="hidden sm:inline-flex"
            >
              Exporter
            </PreviewAction>
            <PreviewAction icon={UserPlus} variant="primary">
              Nouveau client
            </PreviewAction>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        <PreviewStatCard
          label="Clients actifs"
          value="1 284"
          detail="+15 ce mois"
          icon={Users}
          tone="navy"
        />
        <PreviewStatCard
          label="Nouveaux ce mois"
          value="42"
          detail="+8,4 % vs octobre"
          icon={UserPlus}
          tone="success"
        />
        <PreviewStatCard
          label="Encours client"
          value="3 850 000 FCFA"
          detail="12 factures en attente"
          icon={Wallet}
          tone="primary"
          detailTone="muted"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <PreviewSearch
          placeholder="Rechercher un client…"
          className="max-w-xs flex-1"
        />
        <PreviewAction
          icon={SlidersHorizontal}
          className="hidden sm:inline-flex"
        >
          Tous les segments
        </PreviewAction>
        <span className="ml-auto hidden text-[10px] text-gray-400 md:inline">
          1 284 clients
        </span>
      </div>

      <PreviewTable
        title={
          <p className="text-[11px] font-semibold text-gray-800 sm:text-xs">
            Portefeuille clients
          </p>
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
            <PreviewTh className="hidden md:table-cell">Segment</PreviewTh>
            <PreviewTh className="hidden lg:table-cell">
              Dernière commande
            </PreviewTh>
            <PreviewTh className="text-right">CA total</PreviewTh>
            <PreviewTh className="text-right">Statut</PreviewTh>
          </tr>
        }
        footer={
          <div className="flex items-center justify-between gap-3">
            <span>1–7 sur 1 284 clients</span>
            <div className="flex items-center gap-3 text-gray-400">
              <span className="inline-flex items-center gap-0.5">
                <ChevronLeft className="size-3" aria-hidden="true" />
                Précédent
              </span>
              <span className="inline-flex items-center gap-0.5 font-medium text-gray-600">
                Suivant
                <ChevronRight className="size-3" aria-hidden="true" />
              </span>
            </div>
          </div>
        }
      >
        {CUSTOMERS.map((customer) => (
          <tr
            key={customer.name}
            className="transition-colors hover:bg-gray-50/70"
          >
            <PreviewTd>
              <div className="flex items-center gap-2">
                <PreviewAvatar
                  initials={customer.initials}
                  tone={customer.avatarTone}
                  className="hidden sm:flex"
                />
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-medium text-gray-900 sm:text-[11px]">
                    {customer.name}
                  </p>
                  <p className="text-[8px] text-gray-400 sm:hidden">
                    {customer.segment}
                  </p>
                </div>
              </div>
            </PreviewTd>
            <PreviewTd className="hidden text-gray-500 md:table-cell">
              {customer.segment}
            </PreviewTd>
            <PreviewTd className="hidden text-gray-400 lg:table-cell">
              {customer.lastOrder}
            </PreviewTd>
            <PreviewTd className="text-right font-medium whitespace-nowrap text-gray-800 tabular-nums">
              {customer.total}
            </PreviewTd>
            <PreviewTd className="text-right">
              <PreviewStatusBadge tone={customer.tone}>
                {customer.status}
              </PreviewStatusBadge>
            </PreviewTd>
          </tr>
        ))}
      </PreviewTable>
    </div>
  );
}
