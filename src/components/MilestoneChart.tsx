"use client";

import { Briefcase, Gift, Lightbulb, MapPin, Star } from "lucide-react";
import { useRef } from "react";
import ExportMenu from "./ExportMenu";
import SectionShareButton from "./SectionShareButton";
import { CompEntry, EntryType } from "@/lib/types";
import { formatCompact, sortByDate, totalComp } from "@/lib/calculations";

interface MilestoneChartProps {
  entries: CompEntry[];
  currency: string;
  title: string;
  note: string;
  slug?: string | null;
}

const SECTION_ID = "chart-section";

const TYPE_ICON: Partial<Record<EntryType, typeof Star>> = {
  promotion: Star,
  relocation: MapPin,
  new_job: Briefcase,
};

function colorForType(type: EntryType): string {
  if (type === "promotion") return "var(--status-good)";
  if (type === "relocation") return "var(--series-2)";
  return "var(--series-1)";
}

const CHART_TOP_PCT = 40;
const CHART_BOTTOM_PCT = 12;
const CHART_HEIGHT_PX = 220;
const DOT_RADIUS_PX = 6;

export default function MilestoneChart({ entries, currency, title, note, slug }: MilestoneChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sorted = sortByDate(entries);
  const n = sorted.length;

  if (n === 0) {
    return (
      <div
        className="flex h-64 items-center justify-center rounded-lg border text-sm"
        style={{ borderColor: "var(--gridline)", background: "var(--surface-1)", color: "var(--text-muted)" }}
      >
        Add career events to build your progression card.
      </div>
    );
  }

  const values = sorted.map(totalComp);
  // Comp typically grows multiplicatively (raises/promotions are %-based), and can
  // span very different orders of magnitude across a long career. A linear scale
  // squashes early, smaller values together and can hide real growth between them,
  // so we position points on a log scale — each step then reflects relative (%)
  // growth rather than absolute distance from the largest value.
  const logValues = values.map((v) => Math.log(Math.max(v, 1)));
  const minLog = Math.min(...logValues);
  const maxLog = Math.max(...logValues);
  const rangeLog = maxLog - minLog || 1;

  const points = sorted.map((entry, i) => {
    const value = totalComp(entry);
    const logValue = Math.log(Math.max(value, 1));
    const x = n === 1 ? 50 : ((i + 0.5) / n) * 100;
    const y =
      CHART_TOP_PCT + (1 - (logValue - minLog) / rangeLog) * (100 - CHART_TOP_PCT - CHART_BOTTOM_PCT);
    return {
      entry,
      value,
      x,
      y,
      color: colorForType(entry.type),
      Icon: TYPE_ICON[entry.type],
      dateLabel: new Date(entry.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  });

  const years = sorted.map((e) => new Date(e.date).getFullYear());
  const yearRange =
    Math.min(...years) === Math.max(...years)
      ? `${Math.min(...years)}`
      : `${Math.min(...years)} – ${Math.max(...years)}`;

  const hasPromotion = sorted.some((e) => e.type === "promotion");
  const hasRelocation = sorted.some((e) => e.type === "relocation");
  const hasBonus = sorted.some((e) => e.bonus > 0);

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div
      ref={containerRef}
      id={SECTION_ID}
      className="relative scroll-mt-4 rounded-lg border p-5 sm:p-6"
      style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
    >
      <div className="absolute top-3 right-3 flex items-center gap-1.5" data-export-ignore>
        <SectionShareButton slug={slug} anchor={SECTION_ID} />
        <ExportMenu getNode={() => containerRef.current} filename={`${title}-chart`} label="chart" />
      </div>
      <div className="mb-1 text-center">
        <h2
          className="text-lg font-extrabold tracking-tight uppercase sm:text-xl"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
          {yearRange}
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
        <span>All amounts in {currency}</span>
        {hasPromotion && (
          <LegendItem icon={<Star size={12} style={{ color: "var(--status-good)" }} />} label="Promotion" />
        )}
        {hasRelocation && (
          <LegendItem icon={<MapPin size={12} style={{ color: "var(--series-2)" }} />} label="Relocation" />
        )}
        {hasBonus && (
          <LegendItem icon={<Gift size={12} style={{ color: "var(--series-2)" }} />} label="One-time bonus" />
        )}
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: `${Math.max(n * 130, 480)}px` }}>
          <div className="relative" style={{ height: CHART_HEIGHT_PX }}>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="var(--series-1)"
                strokeWidth={0.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {points.map((p) => {
              const connectorHeight = Math.max(
                CHART_HEIGHT_PX * (1 - p.y / 100) - DOT_RADIUS_PX,
                0
              );

              return (
                <div
                  key={p.entry.id}
                  className="absolute"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ background: p.color, boxShadow: "0 0 0 2px var(--surface-1)" }}
                  />
                  <div
                    className="absolute top-full left-1/2 border-l border-dashed"
                    style={{ height: connectorHeight, borderColor: "var(--text-muted)" }}
                  />
                  <div className="absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 pb-2">
                    {p.Icon && <p.Icon size={14} style={{ color: p.color }} />}
                    <span
                      className="whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
                      style={{ background: p.color }}
                    >
                      {formatCompact(p.value, currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {points.map((p) => (
              <div key={p.entry.id} className="flex flex-col items-center px-1 text-center">
                <p className="mt-1 text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                  {p.dateLabel}
                </p>
                <div
                  className="mt-1 w-full rounded-md border px-2 py-1.5 text-[11px] leading-snug"
                  style={{ borderColor: p.color, color: "var(--text-secondary)" }}
                >
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {p.entry.title}
                  </p>
                  {p.entry.note && <p className="mt-0.5">{p.entry.note}</p>}
                  {p.entry.bonus > 0 && (
                    <p className="mt-0.5 flex items-center justify-center gap-1" style={{ color: "var(--series-2)" }}>
                      <Gift size={11} /> Bonus
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {note.trim() && (
        <div
          className="mt-5 flex items-start gap-2 rounded-md border border-dashed px-3 py-2 text-xs"
          style={{
            borderColor: "var(--series-1)",
            background: "color-mix(in srgb, var(--series-1) 8%, var(--surface-1))",
            color: "var(--text-primary)",
          }}
        >
          <Lightbulb size={14} style={{ color: "var(--series-1)", flexShrink: 0, marginTop: 2 }} />
          <p>
            <strong>Note:</strong> {note}
          </p>
        </div>
      )}
    </div>
  );
}

function LegendItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1">
      {icon}
      {label}
    </span>
  );
}
