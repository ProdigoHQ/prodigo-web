import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  PackageSearch,
  Plus,
  Warehouse,
  Wallet,
} from "lucide-react";
import { StockLevelBar } from "./charts";
import {
  PreviewAction,
  PreviewPageHeader,
  PreviewStatCard,
  PreviewStatusBadge,
  PreviewTable,
  PreviewTd,
  PreviewTh,
} from "./shared";
import type { StatusTone } from "./types";

type StockRow = {
  name: string;
  sku: string;
  warehouse: string;
  quantity: number;
  threshold: number;
  level: number;
  status: string;
  tone: StatusTone;
};

const STOCK_ROWS: StockRow[] = [
  {
    name: "Riz parfumé 25 kg",
    sku: "PRD-0042",
    warehouse: "Douala",
    quantity: 124,
    threshold: 40,
    level: 89,
    status: "En stock",
    tone: "success",
  },
  {
    name: "Huile de palme 5 L",
    sku: "PRD-0087",
    warehouse: "Douala",
    quantity: 38,
    threshold: 25,
    level: 27,
    status: "En stock",
    tone: "success",
  },
  {
    name: "Ciment 50 kg",
    sku: "PRD-0103",
    warehouse: "Yaoundé",
    quantity: 9,
    threshold: 20,
    level: 6,
    status: "Stock faible",
    tone: "warning",
  },
  {
    name: "Sucre 1 kg",
    sku: "PRD-0056",
    warehouse: "Yaoundé",
    quantity: 0,
    threshold: 15,
    level: 0,
    status: "Rupture",
    tone: "error",
  },
  {
    name: "Savon de Marseille",
    sku: "PRD-0061",
    warehouse: "Douala",
    quantity: 86,
    threshold: 30,
    level: 61,
    status: "En stock",
    tone: "success",
  },
  {
    name: "Jus d’ananas 1 L",
    sku: "PRD-0074",
    warehouse: "Douala",
    quantity: 54,
    threshold: 20,
    level: 38,
    status: "En stock",
    tone: "success",
  },
];

function barTone(tone: StatusTone) {
  if (tone === "error") return "error" as const;
  if (tone === "warning") return "warning" as const;
  return "primary" as const;
}

export default function PreviewInventory() {
  return (
    <div className="space-y-3">
      <PreviewPageHeader
        title="Stock"
        description="Surveillez vos quantités, seuils et alertes de réassort."
        actions={
          <>
            <PreviewAction
              icon={Warehouse}
              className="hidden sm:inline-flex"
            >
              3 entrepôts
            </PreviewAction>
            <PreviewAction icon={Plus} variant="primary">
              Réapprovisionner
            </PreviewAction>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        <PreviewStatCard
          label="Valeur du stock"
          value="8 750 000 FCFA"
          detail="+4,1 % vs octobre"
          icon={Wallet}
          tone="primary"
        />
        <PreviewStatCard
          label="Produits suivis"
          value="248"
          detail="3 entrepôts actifs"
          icon={Boxes}
          tone="navy"
          detailTone="muted"
        />
        <PreviewStatCard
          label="Alertes de stock"
          value="6"
          detail="2 ruptures à traiter"
          icon={AlertTriangle}
          tone="warning"
          detailTone="warning"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
        <AlertTriangle
          className="size-3.5 shrink-0 text-warning"
          aria-hidden="true"
        />
        <p className="min-w-0 truncate text-[10px] font-medium text-warning">
          6 produits approchent du seuil de réapprovisionnement.
        </p>
        <span className="ml-auto hidden shrink-0 items-center gap-1 text-[9px] font-semibold text-warning sm:flex">
          Voir les alertes
          <ArrowUpRight className="size-2.5" aria-hidden="true" />
        </span>
      </div>

      <PreviewTable
        title={
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-semibold text-gray-800 sm:text-xs">
              Niveaux de stock
            </p>
            <span className="rounded-full bg-warning/10 px-1.5 py-0.5 text-[8px] font-medium text-warning">
              6 alertes
            </span>
          </div>
        }
        action={
          <span className="inline-flex items-center gap-1">
            <PackageSearch className="size-2.5" aria-hidden="true" />
            Inventaire
          </span>
        }
        head={
          <tr>
            <PreviewTh>Produit</PreviewTh>
            <PreviewTh className="hidden md:table-cell">Entrepôt</PreviewTh>
            <PreviewTh>Quantité</PreviewTh>
            <PreviewTh className="text-right">Statut</PreviewTh>
          </tr>
        }
        footer={
          <div className="flex items-center justify-between gap-3">
            <span>6 produits sur 248</span>
            <span>Mise à jour il y a 4 min</span>
          </div>
        }
      >
        {STOCK_ROWS.map((row) => (
          <tr
            key={row.sku}
            className="transition-colors hover:bg-gray-50/70"
          >
            <PreviewTd>
              <p className="truncate text-[10px] font-medium text-gray-900 sm:text-[11px]">
                {row.name}
              </p>
              <p className="text-[8px] text-gray-400 sm:text-[9px]">
                {row.sku}
              </p>
            </PreviewTd>
            <PreviewTd className="hidden text-gray-500 md:table-cell">
              {row.warehouse}
            </PreviewTd>
            <PreviewTd>
              <div className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-[10px] font-medium text-gray-800 tabular-nums sm:w-14">
                  {row.quantity} u.
                </span>
                <StockLevelBar
                  value={row.level}
                  tone={barTone(row.tone)}
                  className="hidden sm:block"
                />
                <span className="hidden text-[9px] text-gray-400 lg:inline">
                  seuil {row.threshold}
                </span>
              </div>
            </PreviewTd>
            <PreviewTd className="text-right">
              <PreviewStatusBadge tone={row.tone}>
                {row.status}
              </PreviewStatusBadge>
            </PreviewTd>
          </tr>
        ))}
      </PreviewTable>
    </div>
  );
}
