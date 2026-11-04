"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { PreviewProgress } from "./shared";

const CHART_WIDTH = 600;
const CHART_HEIGHT = 160;
const CHART_PADDING_X = 4;
const CHART_PADDING_TOP = 10;
const CHART_PADDING_BOTTOM = 8;

type RevenueAreaChartProps = {
  values: number[];
  previousYear: number[];
  labels: string[];
};

function buildPoints(values: number[], maxValue: number) {
  const plotWidth = CHART_WIDTH - CHART_PADDING_X * 2;
  const plotHeight =
    CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
  const step = values.length > 1 ? plotWidth / (values.length - 1) : 0;

  return values.map((value, index) => ({
    x: CHART_PADDING_X + index * step,
    y: CHART_PADDING_TOP + (1 - value / maxValue) * plotHeight,
  }));
}

function toLinePath(points: { x: number; y: number }[]) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
    )
    .join(" ");
}

export function RevenueAreaChart({
  values,
  previousYear,
  labels,
}: RevenueAreaChartProps) {
  const id = useId().replace(/:/g, "");
  const areaGradientId = `revenue-area-${id}`;
  const maxValue = Math.max(...values, ...previousYear) * 1.08;
  const points = buildPoints(values, maxValue);
  const previousPoints = buildPoints(previousYear, maxValue);
  const linePath = toLinePath(points);
  const areaPath = `${linePath} L${CHART_WIDTH - CHART_PADDING_X},${CHART_HEIGHT} L${CHART_PADDING_X},${CHART_HEIGHT} Z`;
  const lastPoint = points[points.length - 1];

  return (
    <div>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        className="h-[92px] w-full sm:h-[104px]"
        role="img"
        aria-label="Évolution du chiffre d’affaires sur les douze derniers mois"
      >
        <defs>
          <linearGradient
            id={areaGradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--color-primary)"
              stopOpacity="0.18"
            />
            <stop
              offset="100%"
              stopColor="var(--color-primary)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[0.08, 0.32, 0.56, 0.8].map((position) => (
          <line
            key={position}
            x1={CHART_PADDING_X}
            y1={CHART_HEIGHT * position}
            x2={CHART_WIDTH - CHART_PADDING_X}
            y2={CHART_HEIGHT * position}
            stroke="var(--color-gray-200)"
            strokeWidth="1"
            strokeDasharray="3 5"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path d={areaPath} fill={`url(#${areaGradientId})`} />
        <path
          d={toLinePath(previousPoints)}
          fill="none"
          stroke="var(--color-gray-300)"
          strokeWidth="1.25"
          strokeDasharray="4 5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="4"
          fill="var(--color-primary)"
          stroke="white"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="mt-1.5 flex items-center justify-between gap-1">
        {labels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className={cn(
              "text-[8px] text-gray-400 tabular-nums sm:text-[9px]",
              index === labels.length - 1 &&
                "font-semibold text-gray-600",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

type MonthlyBarChartProps = {
  values: number[];
  labels: string[];
  ariaLabel: string;
};

export function MonthlyBarChart({
  values,
  labels,
  ariaLabel,
}: MonthlyBarChartProps) {
  const maxValue = Math.max(...values);

  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="flex h-[104px] items-end gap-1 sm:h-[118px] sm:gap-2">
        {values.map((value, index) => {
          const isLatest = index === values.length - 1;

          return (
            <div
              key={`${value}-${index}`}
              className="flex h-full flex-1 flex-col justify-end"
            >
              <div
                className={cn(
                  "w-full rounded-t-[3px] transition-colors duration-200 motion-reduce:transition-none",
                  isLatest
                    ? "bg-primary"
                    : "bg-primary/25 hover:bg-primary/40",
                )}
                style={{
                  height: `${Math.max(5, (value / maxValue) * 100)}%`,
                }}
                title={`${labels[index]} : ${value.toLocaleString("fr-FR")} M FCFA`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between gap-1">
        {labels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className={cn(
              "text-[8px] text-gray-400 sm:text-[9px]",
              index === labels.length - 1 &&
                "font-semibold text-gray-600",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export type CategoryBar = {
  label: string;
  value: number;
};

type CategoryBarsProps = {
  items: CategoryBar[];
};

export function CategoryBars({ items }: CategoryBarsProps) {
  return (
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="truncate text-[10px] font-medium text-gray-600">
              {item.label}
            </span>
            <span className="text-[10px] font-semibold text-gray-900 tabular-nums">
              {item.value} %
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn(
                "h-full rounded-full bg-primary",
                index === 1 && "bg-primary/80",
                index === 2 && "bg-primary/60",
                index === 3 && "bg-primary/40",
              )}
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StockLevelBar({
  value,
  tone = "primary",
  className,
}: {
  value: number;
  tone?: "primary" | "warning" | "error";
  className?: string;
}) {
  return (
    <PreviewProgress
      value={value}
      tone={tone}
      className={cn("h-1 w-14 shrink-0 sm:w-16", className)}
    />
  );
}
