import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Plus,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import {
  PreviewAction,
  PreviewPageHeader,
  PreviewSearch,
  PreviewStatCard,
  PreviewStatusBadge,
  PreviewTable,
  PreviewTd,
  PreviewTh,
} from "./shared";
import type { StatusTone } from "./types";

type Invoice = {
  number: string;
  client: string;
  date: string;
  amount: string;
  method: string;
  status: string;
  tone: StatusTone;
};

const INVOICES: Invoice[] = [
  {
    number: "FAC-2026-0148",
    client: "Kheops Distribution",
    date: "12 nov. 2026",
    amount: "1 250 000 FCFA",
    method: "Virement",
    status: "En attente",
    tone: "warning",
  },
  {
    number: "FAC-2026-0147",
    client: "Boutique Baobab",
    date: "11 nov. 2026",
    amount: "450 000 FCFA",
    method: "MTN MoMo",
    status: "Payée",
    tone: "success",
  },
  {
    number: "FAC-2026-0146",
    client: "Sahel Market",
    date: "09 nov. 2026",
    amount: "96 000 FCFA",
    method: "Orange Money",
    status: "Payée",
    tone: "success",
  },
  {
    number: "FAC-2026-0145",
    client: "Lagune Services",
    date: "05 nov. 2026",
    amount: "320 000 FCFA",
    method: "Virement",
    status: "En retard",
    tone: "error",
  },
  {
    number: "FAC-2026-0144",
    client: "Maya Coiffure",
    date: "02 nov. 2026",
    amount: "85 000 FCFA",
    method: "Espèces",
    status: "Payée",
    tone: "success",
  },
  {
    number: "FAC-2026-0143",
    client: "Ndiaye & Fils",
    date: "01 nov. 2026",
    amount: "540 000 FCFA",
    method: "MTN MoMo",
    status: "Payée",
    tone: "success",
  },
];

function invoiceTone(tone: StatusTone) {
  if (tone === "error") return "text-error" as const;
  if (tone === "warning") return "text-warning" as const;
  return "text-success" as const;
}

export default function PreviewInvoices() {
  return (
    <div className="space-y-3">
      <PreviewPageHeader
        title="Factures"
        description="Créez, envoyez et suivez vos encaissements en temps réel."
        actions={
          <>
            <PreviewAction
              icon={Download}
              className="hidden sm:inline-flex"
            >
              Exporter
            </PreviewAction>
            <PreviewAction icon={Plus} variant="primary">
              Nouvelle facture
            </PreviewAction>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        <PreviewStatCard
          label="Encaissé ce mois"
          value="9 200 000 FCFA"
          detail="+18,2 % vs octobre"
          icon={Wallet}
          tone="success"
        />
        <PreviewStatCard
          label="En attente"
          value="3 250 000 FCFA"
          detail="12 factures"
          icon={Clock3}
          tone="navy"
          detailTone="muted"
        />
        <PreviewStatCard
          label="En retard"
          value="640 000 FCFA"
          detail="3 factures à relancer"
          icon={AlertTriangle}
          tone="warning"
          detailTone="error"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <PreviewSearch
          placeholder="Rechercher une facture…"
          className="max-w-xs flex-1"
        />
        <PreviewAction
          icon={SlidersHorizontal}
          className="hidden sm:inline-flex"
        >
          Toutes les factures
        </PreviewAction>
        <span className="ml-auto hidden text-[10px] text-gray-400 md:inline">
          Novembre 2026
        </span>
      </div>

      <PreviewTable
        title={
          <p className="text-[11px] font-semibold text-gray-800 sm:text-xs">
            Factures récentes
          </p>
        }
        action="1 248 factures"
        head={
          <tr>
            <PreviewTh>Facture</PreviewTh>
            <PreviewTh className="hidden md:table-cell">Date</PreviewTh>
            <PreviewTh className="text-right">Montant</PreviewTh>
            <PreviewTh className="text-right">Statut</PreviewTh>
          </tr>
        }
        footer={
          <div className="flex items-center justify-between gap-3">
            <span>1–6 sur 1 248 factures</span>
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
        {INVOICES.map((invoice) => (
          <tr
            key={invoice.number}
            className="transition-colors hover:bg-gray-50/70"
          >
            <PreviewTd>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium text-gray-900 sm:text-[11px]">
                  {invoice.number}
                </p>
                <p className="truncate text-[8px] text-gray-400 sm:text-[9px]">
                  {invoice.client}
                </p>
              </div>
            </PreviewTd>
            <PreviewTd className="hidden text-gray-400 md:table-cell">
              {invoice.date}
            </PreviewTd>
            <PreviewTd className="text-right">
              <p className="font-medium whitespace-nowrap text-gray-800 tabular-nums">
                {invoice.amount}
              </p>
              <p className="text-[8px] text-gray-400 sm:text-[9px]">
                {invoice.method}
              </p>
            </PreviewTd>
            <PreviewTd className="text-right">
              <PreviewStatusBadge tone={invoice.tone}>
                {invoice.status}
              </PreviewStatusBadge>
              <p
                className={`mt-0.5 hidden text-[8px] font-medium sm:block ${invoiceTone(invoice.tone)}`}
              >
                {invoice.tone === "success"
                  ? "Réglée"
                  : invoice.tone === "error"
                    ? "3 jours"
                    : "Échéance 18 nov."}
              </p>
            </PreviewTd>
          </tr>
        ))}
      </PreviewTable>
    </div>
  );
}
