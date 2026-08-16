"use client";

import { CompEntry, ENTRY_TYPE_LABELS } from "@/lib/types";
import { formatCurrency, formatPct, pctChange, sortByDate, totalComp } from "@/lib/calculations";

interface TimelineViewProps {
  entries: CompEntry[];
  currency: string;
}

export default function TimelineView({ entries, currency }: TimelineViewProps) {
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
    <div className="rounded-lg border p-5" style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}>
      <h2 className="mb-4 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        Timeline
      </h2>
      <ol className="flex flex-col gap-4">
        {sorted.map((entry) => {
          const ascIndex = ascending.findIndex((e) => e.id === entry.id);
          const change = ascIndex > 0 ? pctChange(totalComp(ascending[ascIndex - 1]), totalComp(entry)) : null;

          return (
            <li
              key={entry.id}
              className="relative border-l-2 pl-4"
              style={{ borderColor: "var(--baseline)" }}
            >
              <span
                className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full"
                style={{ background: "var(--series-1)" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {entry.title} {entry.level && <span style={{ color: "var(--text-muted)" }}>· {entry.level}</span>}
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {entry.company} · {formatDate(entry.date)} · {ENTRY_TYPE_LABELS[entry.type]}
                </p>
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--text-primary)" }}>
                {formatCurrency(totalComp(entry), currency)}
                {change !== null && (
                  <span
                    className="ml-2 text-xs font-medium"
                    style={{ color: change >= 0 ? "var(--success-text)" : "var(--text-secondary)" }}
                  >
                    {formatPct(change, { signed: true })}
                  </span>
                )}
              </p>
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
