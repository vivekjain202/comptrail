import { CompEntry } from "./types";

export function totalComp(entry: CompEntry): number {
  return entry.base + entry.bonus + entry.equity;
}

export function sortByDate(entries: CompEntry[]): CompEntry[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

export interface TimelineStats {
  yearsSpanned: number;
  totalGrowthPct: number | null;
  cagrPct: number | null;
  biggestJumpPct: number | null;
  biggestJumpEntryId: string | null;
  latestTotalComp: number | null;
}

export function computeStats(entries: CompEntry[]): TimelineStats {
  const sorted = sortByDate(entries);

  if (sorted.length === 0) {
    return {
      yearsSpanned: 0,
      totalGrowthPct: null,
      cagrPct: null,
      biggestJumpPct: null,
      biggestJumpEntryId: null,
      latestTotalComp: null,
    };
  }

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const firstComp = totalComp(first);
  const lastComp = totalComp(last);

  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const yearsSpanned =
    (new Date(last.date).getTime() - new Date(first.date).getTime()) / msPerYear;

  const totalGrowthPct =
    firstComp > 0 ? ((lastComp - firstComp) / firstComp) * 100 : null;

  const cagrPct =
    firstComp > 0 && yearsSpanned > 0
      ? (Math.pow(lastComp / firstComp, 1 / yearsSpanned) - 1) * 100
      : null;

  let biggestJumpPct: number | null = null;
  let biggestJumpEntryId: string | null = null;
  for (let i = 1; i < sorted.length; i++) {
    const prevComp = totalComp(sorted[i - 1]);
    const currComp = totalComp(sorted[i]);
    if (prevComp <= 0) continue;
    const jumpPct = ((currComp - prevComp) / prevComp) * 100;
    if (biggestJumpPct === null || jumpPct > biggestJumpPct) {
      biggestJumpPct = jumpPct;
      biggestJumpEntryId = sorted[i].id;
    }
  }

  return {
    yearsSpanned,
    totalGrowthPct,
    cagrPct,
    biggestJumpPct,
    biggestJumpEntryId,
    latestTotalComp: lastComp,
  };
}

export function pctChange(prev: number, curr: number): number | null {
  if (prev <= 0) return null;
  return ((curr - prev) / prev) * 100;
}

export function formatPct(value: number, options?: { signed?: boolean }): string {
  const sign = options?.signed && value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
}

export function formatCompact(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
}
