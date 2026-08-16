"use client";

import { useRef, useState } from "react";
import ExportMenu from "../ExportMenu/ExportMenu";
import SectionShareButton from "../SectionShareButton/SectionShareButton";
import { CompEntry } from "@/lib/types";
import { formatCurrency, sortByDate } from "@/lib/calculations";

interface BaseEquityChartProps {
  entries: CompEntry[];
  currency: string;
  title?: string;
  slug?: string | null;
  readOnly?: boolean;
}

const SECTION_ID = "base-equity-section";

// Below this many entries with real equity, a "progression" line is just noise —
// there's nothing to show a trend between.
const MIN_EQUITY_ENTRIES = 2;

const CHART_TOP_PCT = 12;
const CHART_BOTTOM_PCT = 15;
const CHART_HEIGHT_PX = 200;

// Below this vertical gap (in % of chart height), the two dots visually
// overlap and the top one hides the bottom one — nudge them apart horizontally
// so both stay visible even when their values are close.
const OVERLAP_THRESHOLD_PCT = 4;
const OVERLAP_NUDGE_PX = 4;

// Reserved vertical gap (in % of chart height) between the zero baseline and
// the smallest positive value on the log scale — without it, a value that
// happens to be the smallest in the dataset maps to fraction 0 and lands on
// the exact same baseline pixel as an actual zero.
const ZERO_GAP_PCT = 10;

export function hasBaseEquityTrend(entries: CompEntry[]): boolean {
  return entries.filter((e) => e.equity > 0).length >= MIN_EQUITY_ENTRIES;
}

export default function BaseEquityChart({
  entries,
  currency,
  title = "CompTrail",
  slug,
  readOnly = false,
}: BaseEquityChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!hasBaseEquityTrend(entries)) {
    return null;
  }

  const sorted = sortByDate(entries);
  const n = sorted.length;

  // Base and equity can span orders of magnitude across a career (see
  // MilestoneChart), so a linear scale squashes early/small values together —
  // position on a log scale instead. Zero (no equity yet) has no log and is
  // pinned to the baseline rather than joining the log-scaled range.
  const positiveValues = [...sorted.map((e) => e.base), ...sorted.map((e) => e.equity)].filter((v) => v > 0);
  const logValues = positiveValues.map((v) => Math.log(v));
  const minLog = logValues.length ? Math.min(...logValues) : 0;
  const maxLog = logValues.length ? Math.max(...logValues) : 1;
  const rangeLog = maxLog - minLog || 1;
  const BASELINE_PCT = 100 - CHART_BOTTOM_PCT;
  const POSITIVE_BOTTOM_PCT = BASELINE_PCT - ZERO_GAP_PCT;

  function yFor(value: number): number {
    if (value <= 0) return BASELINE_PCT;
    const fraction = (Math.log(value) - minLog) / rangeLog;
    return CHART_TOP_PCT + (1 - fraction) * (POSITIVE_BOTTOM_PCT - CHART_TOP_PCT);
  }

  const points = sorted.map((entry, i) => ({
    entry,
    x: n === 1 ? 50 : ((i + 0.5) / n) * 100,
    baseY: yFor(entry.base),
    equityY: yFor(entry.equity),
    dateLabel: new Date(entry.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  }));

  const basePolyline = points.map((p) => `${p.x},${p.baseY}`).join(" ");
  const equityPolyline = points.map((p) => `${p.x},${p.equityY}`).join(" ");
  const hovered = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div
      ref={containerRef}
      id={SECTION_ID}
      className="relative scroll-mt-20 rounded-lg border p-5"
      style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Base vs equity
          </h2>
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
            <LegendItem color="var(--series-1)" label="Base salary" />
            <LegendItem color="var(--series-2)" label="Equity" />
          </div>
        </div>
        {!readOnly && (
          <div className="flex items-center gap-1.5" data-export-ignore>
            <SectionShareButton slug={slug} anchor={SECTION_ID} />
            <ExportMenu
              getNode={() => containerRef.current}
              filename={`${title}-base-vs-equity`}
              label="base vs equity chart"
            />
          </div>
        )}
      </div>

      <div className="relative" style={{ height: CHART_HEIGHT_PX }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <polyline
            points={basePolyline}
            fill="none"
            stroke="var(--series-1)"
            strokeWidth={0.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={equityPolyline}
            fill="none"
            stroke="var(--series-2)"
            strokeWidth={0.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {points.map((p) => {
          const overlapping = Math.abs(p.baseY - p.equityY) < OVERLAP_THRESHOLD_PCT;
          const nudge = overlapping ? OVERLAP_NUDGE_PX : 0;
          return (
            <div key={p.entry.id}>
              <div
                className="absolute h-2.5 w-2.5 rounded-full"
                style={{
                  left: `calc(${p.x}% - ${nudge}px)`,
                  top: `${p.baseY}%`,
                  transform: "translate(-50%, -50%)",
                  background: "var(--series-1)",
                  boxShadow: "0 0 0 2px var(--surface-1)",
                }}
              />
              <div
                className="absolute h-2.5 w-2.5 rounded-full"
                style={{
                  left: `calc(${p.x}% + ${nudge}px)`,
                  top: `${p.equityY}%`,
                  transform: "translate(-50%, -50%)",
                  background: "var(--series-2)",
                  boxShadow: "0 0 0 2px var(--surface-1)",
                }}
              />
            </div>
          );
        })}

        {points.map((p, i) => (
          <button
            key={p.entry.id}
            type="button"
            className="absolute top-0 h-full -translate-x-1/2 cursor-default"
            style={{ left: `${p.x}%`, width: `${100 / n}%` }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(i)}
            onBlur={() => setHoveredIndex(null)}
            aria-label={`${p.entry.title} base and equity for ${p.dateLabel}`}
          />
        ))}

        {hovered && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg border px-3 py-2 text-xs whitespace-nowrap shadow-lg"
            style={{
              left: `${hovered.x}%`,
              top: `${Math.min(hovered.baseY, hovered.equityY)}%`,
              transform: "translate(-50%, calc(-100% - 12px))",
              borderColor: "var(--gridline)",
              background: "var(--surface-1)",
            }}
            data-export-ignore
          >
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>
              {hovered.dateLabel}
            </p>
            <p style={{ color: "var(--series-1)" }}>Base: {formatCurrency(hovered.entry.base, currency)}</p>
            <p style={{ color: "var(--series-2)" }}>Equity: {formatCurrency(hovered.entry.equity, currency)}</p>
          </div>
        )}
      </div>

      <div className="mt-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {points.map((p) => (
          <p key={p.entry.id} className="text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
            {p.dateLabel}
          </p>
        ))}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-0.5 w-3 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
