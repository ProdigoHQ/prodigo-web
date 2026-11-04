import {
  BarChart3,
  Download,
  Percent,
  ShoppingBag,
} from "lucide-react";
import { CategoryBars, MonthlyBarChart } from "./charts";
import {
  PreviewAction,
  PreviewPageHeader,
  PreviewPanel,
  PreviewProgress,
  PreviewStatCard,
  PreviewTable,
  PreviewTd,
  PreviewTh,
} from "./shared";

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

const MONTHLY_REVENUE = [
  8.4, 9.1, 8.8, 10.2, 11.4, 10.8, 12.1, 13.0, 12.4, 13.8, 14.2, 18.6,
];

const CATEGORY_MIX = [
  { label: "Alimentaire", value: 42 },
  { label: "Construction", value: 28 },
  { label: "Hygiène", value: 18 },
  { label: "Boissons", value: 12 },
];

const TOP_PRODUCTS = [
  {
    name: "Riz parfumé 25 kg",
    category: "Alimentaire",
    revenue: "28 400 000 FCFA",
    margin: 38.4,
  },
  {
    name: "Ciment 50 kg",
    category: "Construction",
    revenue: "21 200 000 FCFA",
    margin: 33.8,
  },
  {
    name: "Huile de palme 5 L",
    category: "Alimentaire",
    revenue: "17 600 000 FCFA",
    margin: 31.2,
  },
];

export default function PreviewReports() {
  return (
    <div className="space-y-2.5">
      <PreviewPageHeader
        title="Rapports"
        description="Analysez la performance commerciale de votre entreprise."
        actions={
          <>
            <PreviewAction
              icon={BarChart3}
              className="hidden sm:inline-flex"
            >
              12 derniers mois
            </PreviewAction>
            <PreviewAction icon={Download} variant="primary">
              Exporter
            </PreviewAction>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        <PreviewStatCard
          label="CA total"
          value="142 800 000 FCFA"
          detail="+16,4 % sur 12 mois"
          icon={BarChart3}
          tone="primary"
        />
        <PreviewStatCard
          label="Marge brute"
          value="34,2 %"
          detail="+1,8 point"
          icon={Percent}
          tone="success"
        />
        <PreviewStatCard
          label="Panier moyen"
          value="35 800 FCFA"
          detail="+4,6 % vs 2025"
          icon={ShoppingBag}
          tone="navy"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <PreviewPanel className="p-3.5 sm:p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-medium text-gray-400 sm:text-[11px]">
                Revenus par mois
              </p>
              <p className="mt-1 text-lg font-semibold tracking-[-0.01em] text-gray-900 tabular-nums sm:text-xl">
                142 800 000{" "}
                <span className="text-[10px] font-normal text-gray-400">
                  FCFA
                </span>
              </p>
            </div>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-semibold text-success">
              +16,4 %
            </span>
          </div>
          <div className="mt-3">
            <MonthlyBarChart
              values={MONTHLY_REVENUE}
              labels={MONTHS}
              ariaLabel="Revenus mensuels sur les douze derniers mois"
            />
          </div>
        </PreviewPanel>

        <PreviewPanel className="p-3.5 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-medium text-gray-400 sm:text-[11px]">
                Répartition des ventes
              </p>
              <p className="mt-0.5 text-[9px] text-gray-400">
                Par catégorie de produits
              </p>
            </div>
            <span className="text-[9px] font-medium text-gray-400">
              2026
            </span>
          </div>
          <div className="mt-3">
            <CategoryBars items={CATEGORY_MIX} />
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
            <span className="text-[9px] text-gray-400">Total analysé</span>
            <span className="text-[10px] font-semibold text-gray-800 tabular-nums">
              142 800 000 FCFA
            </span>
          </div>
        </PreviewPanel>
      </div>

      <PreviewTable
        title={
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-semibold text-gray-800 sm:text-xs">
              Top produits
            </p>
            <span className="rounded-full bg-primary-light px-1.5 py-0.5 text-[8px] font-medium text-primary">
              12 mois
            </span>
          </div>
        }
        action="Voir le rapport"
        head={
          <tr>
            <PreviewTh>Produit</PreviewTh>
            <PreviewTh className="text-right">Chiffre d’affaires</PreviewTh>
            <PreviewTh className="hidden text-right sm:table-cell">
              Marge
            </PreviewTh>
          </tr>
        }
        footer={
          <div className="flex items-center justify-between gap-3">
            <span>3 produits sur 248</span>
            <span>Analyse basée sur les 12 derniers mois</span>
          </div>
        }
      >
        {TOP_PRODUCTS.map((product) => (
          <tr
            key={product.name}
            className="transition-colors hover:bg-gray-50/70"
          >
            <PreviewTd>
              <p className="truncate text-[10px] font-medium text-gray-900 sm:text-[11px]">
                {product.name}
              </p>
              <p className="text-[8px] text-gray-400 sm:text-[9px]">
                {product.category}
              </p>
            </PreviewTd>
            <PreviewTd className="text-right font-medium whitespace-nowrap text-gray-800 tabular-nums">
              {product.revenue}
            </PreviewTd>
            <PreviewTd className="hidden text-right sm:table-cell">
              <div className="flex items-center justify-end gap-2">
                <span className="text-[10px] font-medium text-gray-700 tabular-nums">
                  {product.margin.toLocaleString("fr-FR")} %
                </span>
                <PreviewProgress
                  value={product.margin}
                  tone="success"
                  className="w-10"
                />
              </div>
            </PreviewTd>
          </tr>
        ))}
      </PreviewTable>
    </div>
  );
}
