"use client";

import { CompEntry } from "@/lib/types";
import { computeStats, formatCurrency, formatPct } from "@/lib/calculations";

interface StatsCardsProps {
  entries: CompEntry[];
  currency: string;
}

export default function StatsCards({ entries, currency }: StatsCardsProps) {
  const stats = computeStats(entries);

  if (entries.length < 2) {
    return null;
  }

  const tiles = [
    {
      label: "Total growth",
      value: stats.totalGrowthPct !== null ? formatPct(stats.totalGrowthPct, { signed: true }) : "—",
    },
    {
      label: "Annualized growth (CAGR)",
      value: stats.cagrPct !== null ? formatPct(stats.cagrPct, { signed: true }) : "—",
    },
    {
      label: "Biggest jump",
      value: stats.biggestJumpPct !== null ? formatPct(stats.biggestJumpPct, { signed: true }) : "—",
    },
    {
      label: "Latest total comp",
      value: stats.latestTotalComp !== null ? formatCurrency(stats.latestTotalComp, currency) : "—",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-lg border p-4"
          style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {tile.label}
          </p>
          <p className="mt-1 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {tile.value}
          </p>
        </div>
      ))}
    </div>
  );
}
