import { computeStats, formatCurrency, formatPct, pctChange, sortByDate, totalComp } from "@/lib/calculations";
import type { CompEntry } from "@/lib/types";
import { describe, expect, it } from "vitest";

const entries: CompEntry[] = [
  {
    id: "senior",
    date: "2024-01-01",
    company: "Beta",
    title: "Senior Engineer",
    level: "L5",
    type: "promotion",
    base: 150_000,
    bonus: 20_000,
    equity: 30_000,
    note: "Promotion",
  },
  {
    id: "junior",
    date: "2020-01-01",
    company: "Alpha",
    title: "Engineer",
    level: "L3",
    type: "new_job",
    base: 90_000,
    bonus: 10_000,
    equity: 0,
    note: "First role",
  },
];

describe("compensation calculations", () => {
  it("calculates total compensation and sorts without mutating the input", () => {
    expect(totalComp(entries[0])).toBe(200_000);

    const sorted = sortByDate(entries);
    expect(sorted.map((entry) => entry.id)).toEqual(["junior", "senior"]);
    expect(entries.map((entry) => entry.id)).toEqual(["senior", "junior"]);
  });

  it("computes growth, CAGR, biggest jump, and latest compensation", () => {
    const stats = computeStats(entries);

    expect(stats.yearsSpanned).toBeCloseTo(4, 2);
    expect(stats.totalGrowthPct).toBe(100);
    expect(stats.cagrPct).toBeCloseTo(18.9, 1);
    expect(stats.biggestJumpPct).toBe(100);
    expect(stats.biggestJumpEntryId).toBe("senior");
    expect(stats.latestTotalComp).toBe(200_000);
  });

  it("handles empty, zero-baseline, and short timelines safely", () => {
    expect(computeStats([]).latestTotalComp).toBeNull();
    expect(pctChange(0, 100)).toBeNull();

    const shortTimeline = [
      { ...entries[1], id: "a", date: "2024-01-01", base: 100, bonus: 0, equity: 0 },
      { ...entries[0], id: "b", date: "2024-02-01", base: 200, bonus: 0, equity: 0 },
    ];
    expect(computeStats(shortTimeline).cagrPct).toBeNull();
  });

  it("formats percentages and currencies for display", () => {
    expect(formatPct(12.345, { signed: true })).toBe("+12.35%");
    expect(formatPct(-12.345)).toBe("-12.35%");
    expect(formatCurrency(125_000, "USD")).toBe("$125,000");
  });
});
