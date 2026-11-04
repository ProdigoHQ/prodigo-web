"use client";

import { useState } from "react";
import {
  Boxes,
  Package,
  Percent,
  Plus,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PreviewAction,
  PreviewPageHeader,
  PreviewPanel,
  PreviewStatCard,
  PreviewStatusBadge,
} from "./shared";
import type { StatusTone } from "./types";

const CATEGORIES = [
  "Tous",
  "Alimentaire",
  "Construction",
  "Hygiène",
  "Boissons",
] as const;

type Category = (typeof CATEGORIES)[number];

type Product = {
  name: string;
  sku: string;
  category: Exclude<Category, "Tous">;
  price: string;
  stock: number;
  stockLabel: string;
  tone: StatusTone;
  iconTone: "primary" | "navy" | "success" | "warning";
};

const PRODUCTS: Product[] = [
  {
    name: "Riz parfumé 25 kg",
    sku: "PRD-0042",
    category: "Alimentaire",
    price: "18 500",
    stock: 124,
    stockLabel: "En stock",
    tone: "success",
    iconTone: "primary",
  },
  {
    name: "Huile de palme 5 L",
    sku: "PRD-0087",
    category: "Alimentaire",
    price: "7 200",
    stock: 38,
    stockLabel: "En stock",
    tone: "success",
    iconTone: "navy",
  },
  {
    name: "Ciment 50 kg",
    sku: "PRD-0103",
    category: "Construction",
    price: "5 800",
    stock: 9,
    stockLabel: "Stock faible",
    tone: "warning",
    iconTone: "warning",
  },
  {
    name: "Sucre 1 kg",
    sku: "PRD-0056",
    category: "Alimentaire",
    price: "1 100",
    stock: 0,
    stockLabel: "Rupture",
    tone: "error",
    iconTone: "primary",
  },
  {
    name: "Savon de Marseille",
    sku: "PRD-0061",
    category: "Hygiène",
    price: "2 400",
    stock: 86,
    stockLabel: "En stock",
    tone: "success",
    iconTone: "success",
  },
  {
    name: "Jus d’ananas 1 L",
    sku: "PRD-0074",
    category: "Boissons",
    price: "1 800",
    stock: 54,
    stockLabel: "En stock",
    tone: "success",
    iconTone: "navy",
  },
  {
    name: "Lait en poudre 400 g",
    sku: "PRD-0091",
    category: "Alimentaire",
    price: "3 200",
    stock: 48,
    stockLabel: "En stock",
    tone: "success",
    iconTone: "primary",
  },
  {
    name: "Peinture acrylique 5 L",
    sku: "PRD-0112",
    category: "Construction",
    price: "12 400",
    stock: 21,
    stockLabel: "En stock",
    tone: "success",
    iconTone: "warning",
  },
  {
    name: "Café moulu 500 g",
    sku: "PRD-0068",
    category: "Boissons",
    price: "4 500",
    stock: 67,
    stockLabel: "En stock",
    tone: "success",
    iconTone: "navy",
  },
];

const PRODUCT_ICON_TONES = {
  primary: "bg-primary-light text-primary",
  navy: "bg-navy-light text-navy",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export default function PreviewProducts() {
  const [category, setCategory] = useState<Category>("Tous");
  const visibleProducts =
    category === "Tous"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === category);

  return (
    <div className="space-y-3">
      <PreviewPageHeader
        title="Produits"
        description="Pilotez votre catalogue, vos prix et la disponibilité."
        actions={
          <PreviewAction icon={Plus} variant="primary">
            Ajouter un produit
          </PreviewAction>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        <PreviewStatCard
          label="Références"
          value="248"
          detail="6 catégories"
          icon={Boxes}
          tone="navy"
          detailTone="muted"
        />
        <PreviewStatCard
          label="Valeur du catalogue"
          value="18 400 000 FCFA"
          detail="+6,3 % ce mois"
          icon={Wallet}
          tone="primary"
        />
        <PreviewStatCard
          label="Marge moyenne"
          value="34,2 %"
          detail="+1,8 point"
          icon={Percent}
          tone="success"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="hide-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {CATEGORIES.map((item) => {
          const isActive = category === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={isActive}
              className={cn(
                "h-8 shrink-0 rounded-md border px-2.5 text-[10px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800",
              )}
            >
              {item}
            </button>
          );
        })}
        <span className="ml-auto hidden shrink-0 pl-3 text-[10px] text-gray-400 sm:inline">
          {visibleProducts.length} produit
          {visibleProducts.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid min-h-[500px] content-start grid-cols-2 gap-2.5 sm:min-h-[380px] sm:grid-cols-3 sm:gap-3">
        {visibleProducts.map((product) => (
          <PreviewPanel key={product.sku} className="p-3">
            <div className="flex items-start justify-between gap-2">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  PRODUCT_ICON_TONES[product.iconTone],
                )}
              >
                <Package className="size-4" aria-hidden="true" />
              </span>
              <PreviewStatusBadge tone={product.tone}>
                {product.stockLabel}
              </PreviewStatusBadge>
            </div>
            <p className="mt-2.5 truncate text-[10px] font-semibold text-gray-900 sm:text-[11px]">
              {product.name}
            </p>
            <p className="truncate text-[8px] text-gray-400 sm:text-[9px]">
              {product.sku} · {product.category}
            </p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="text-[10px] font-semibold text-gray-900 tabular-nums sm:text-[11px]">
                {product.price}{" "}
                <span className="text-[8px] font-normal text-gray-400">
                  FCFA
                </span>
              </p>
              <p className="shrink-0 text-[8px] text-gray-400 sm:text-[9px]">
                {product.stock} u.
              </p>
            </div>
          </PreviewPanel>
        ))}
      </div>
    </div>
  );
}
