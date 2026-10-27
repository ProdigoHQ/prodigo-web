"use client";

import { Fragment, useState } from "react";
import {
  Users,
  UsersRound,
  UserRound,
  TrendingUp,
  Package,
  Warehouse,
  ShoppingCart,
  Receipt,
  CreditCard,
  ShoppingBag,
  Store,
  Globe,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/shared/logo";
import { cn } from "@/lib/utils";

type ModuleLevel = "core" | "operational" | "supporting";

type NetworkModule = {
  label: string;
  icon: LucideIcon;
  category: string;
  x: number;
  y: number;
  level: ModuleLevel;
  meta?: string;
  flowDelay?: number;
};

const MODULES: NetworkModule[] = [
  { label: "CRM", icon: Users, category: "commercial", x: 50, y: 8, level: "core" },
  {
    label: "Ventes",
    icon: TrendingUp,
    category: "commercial",
    x: 87,
    y: 32,
    level: "core",
    meta: "+12,8% ce mois",
    flowDelay: 0,
  },
  {
    label: "Stock",
    icon: Warehouse,
    category: "inventory",
    x: 14,
    y: 26,
    level: "core",
    meta: "128 produits",
    flowDelay: 2.3,
  },
  {
    label: "Facturation",
    icon: Receipt,
    category: "finance",
    x: 80,
    y: 80,
    level: "core",
    meta: "24 factures",
    flowDelay: 4.6,
  },
  { label: "Commandes", icon: ShoppingCart, category: "sales", x: 72, y: 15, level: "operational" },
  { label: "Clients", icon: UsersRound, category: "commercial", x: 29, y: 9, level: "supporting" },
  { label: "Produits", icon: Package, category: "inventory", x: 20, y: 44, level: "operational" },
  { label: "Paiements", icon: CreditCard, category: "finance", x: 58, y: 90, level: "operational" },
  { label: "Achats", icon: ShoppingBag, category: "purchasing", x: 10, y: 60, level: "operational" },
  { label: "RH", icon: UserRound, category: "hr", x: 37, y: 80, level: "operational" },
  { label: "POS", icon: Store, category: "sales", x: 95, y: 55, level: "operational" },
  { label: "E-commerce", icon: Globe, category: "commerce", x: 93, y: 6, level: "supporting" },
  { label: "Rapports", icon: BarChart3, category: "analytics", x: 16, y: 90, level: "supporting" },
];

const FEATURES = ["Multi-établissements", "Mobile Money", "Modules évolutifs"];

const COPY = {
  badge: "Prodigo ERP",
  title: "Un seul ERP.",
  titleAccent: "Toutes vos opérations.",
  subtitle:
    "Connectez vos clients, ventes, stocks, factures, paiements et bien plus dans une plateforme modulaire qui évolue avec votre entreprise.",
};

export default function BrandPanel() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="brand-panel">
      <div className="brand-bg" aria-hidden="true" />

      <div className="brand-content">
        <span className="brand-badge">{COPY.badge}</span>
        <h2 className="brand-title">
          {COPY.title}
          <br />
          {COPY.titleAccent}
        </h2>
        <p className="brand-subtitle">{COPY.subtitle}</p>

        <div className="network">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="network__svg"
            aria-hidden="true"
          >
            <g className="network__lines">
              {MODULES.map((m) => (
                <line
                  key={m.label}
                  x1="50"
                  y1="50"
                  x2={m.x}
                  y2={m.y}
                  className={cn(
                    "network__line",
                    m.flowDelay !== undefined && "network__line--flow",
                    m.level === "supporting" && "network__line--supporting",
                    hovered === m.label && "network__line--hovered",
                  )}
                />
              ))}
            </g>
            <g className="network__particles">
              {MODULES.filter((m) => m.flowDelay !== undefined).map((m) => (
                <circle key={m.label} className="network__particle" r="0.55">
                  <animateMotion
                    dur="7s"
                    repeatCount="indefinite"
                    begin={`${m.flowDelay}s`}
                    path={`M ${m.x} ${m.y} L 50 50`}
                  />
                </circle>
              ))}
            </g>
          </svg>

          <div className="network__hub-glow" aria-hidden="true" />
          <div className="network__ring network__ring--outer" aria-hidden="true" />
          <div className="network__ring network__ring--inner" aria-hidden="true" />

          <div className="network__hub">
            <Logo variant="dark" className="network__hub-logo" />
            <span className="network__hub-erp">ERP</span>
          </div>

          {MODULES.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className={cn("network__node", `network__node--${m.level}`)}
                style={{
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                  animationDelay: `${i * 90}ms`,
                }}
                onMouseEnter={() => setHovered(m.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <Icon className="network__node-icon" strokeWidth={2} />
                <span className="network__node-body">
                  <span className="network__node-label">{m.label}</span>
                  {m.meta ? (
                    <span className="network__node-meta">{m.meta}</span>
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>

        <div className="brand-features">
          {FEATURES.map((f, i) => (
            <Fragment key={f}>
              {i > 0 && <span className="brand-features__dot" aria-hidden="true" />}
              <span className="brand-features__item">{f}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
