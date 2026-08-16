"use client";

import { useRef } from "react";
import ExportMenu from "./ExportMenu";
import SectionShareButton from "./SectionShareButton";
import { CompEntry, ENTRY_TYPE_LABELS } from "@/lib/types";
import { formatCurrency, formatPct, pctChange, sortByDate, totalComp } from "@/lib/calculations";

interface TimelineViewProps {
  entries: CompEntry[];
  currency: string;
  title?: string;
  slug?: string | null;
}

const SECTION_ID = "timeline-section";

export default function TimelineView({ entries, currency, title = "Salary Progression", slug }: TimelineViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sorted = sortByDate(entries).reverse();

  if (sorted.length === 0) {
    return (
      <div
        className="flex h-40 items-center justify-center rounded-lg border text-sm"
        style={{ borderColor: "var(--gridline)", background: "var(--surface-1)", color: "var(--text-muted)" }}
      >
        Your timeline will appear here.
      </div>
    );
  }

  const ascending = sortByDate(entries);

  return (
    <div
      ref={containerRef}
      id={SECTION_ID}
      className="scroll-mt-4 rounded-lg border p-5"
      style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Timeline
        </h2>
        <div className="flex items-center gap-1.5" data-export-ignore>
          <SectionShareButton slug={slug} anchor={SECTION_ID} />
          <ExportMenu getNode={() => containerRef.current} filename={`${title}-timeline`} label="timeline" />
        </div>
      </div>
      <ol className="flex flex-col">
        {sorted.map((entry, i) => {
          const ascIndex = ascending.findIndex((e) => e.id === entry.id);
          const change = ascIndex > 0 ? pctChange(totalComp(ascending[ascIndex - 1]), totalComp(entry)) : null;
          const isLast = i === sorted.length - 1;

          return (
            <li
              key={entry.id}
              className={`relative border-l-2 pl-4 ${isLast ? "" : "pb-6"}`}
              style={{ borderColor: "var(--baseline)" }}
            >
              <span
                className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full"
                style={{ background: "var(--series-1)" }}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {entry.title} {entry.level && <span style={{ color: "var(--text-muted)" }}>· {entry.level}</span>}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {entry.company} · {formatDate(entry.date)} · {ENTRY_TYPE_LABELS[entry.type]}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {formatCurrency(totalComp(entry), currency)}
                  </p>
                  {change !== null && (
                    <p
                      className="text-xs font-medium"
                      style={{ color: change >= 0 ? "var(--success-text)" : "var(--text-secondary)" }}
                    >
                      {formatPct(change, { signed: true })}
                    </p>
                  )}
                </div>
              </div>
              {entry.note && (
                <p className="mt-1 text-xs italic" style={{ color: "var(--text-secondary)" }}>
                  {entry.note}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
