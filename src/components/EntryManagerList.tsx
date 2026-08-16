"use client";

import { CompEntry } from "@/lib/types";
import { formatCurrency, sortByDate, totalComp } from "@/lib/calculations";

interface EntryManagerListProps {
  entries: CompEntry[];
  currency: string;
  onEdit: (entry: CompEntry) => void;
  onRemove: (id: string) => void;
  editingId: string | null;
}

export default function EntryManagerList({ entries, currency, onEdit, onRemove, editingId }: EntryManagerListProps) {
  if (entries.length === 0) {
    return (
      <div
        className="flex h-24 items-center justify-center rounded-lg border text-sm"
        style={{ borderColor: "var(--gridline)", background: "var(--surface-1)", color: "var(--text-muted)" }}
      >
        No entries yet — add one above.
      </div>
    );
  }

  const sorted = sortByDate(entries).reverse();

  return (
    <div className="rounded-lg border p-4" style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}>
      <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        Your entries ({entries.length})
      </h2>
      <ul className="flex flex-col gap-2">
        {sorted.map((entry) => {
          const isEditing = entry.id === editingId;
          return (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
              style={{
                borderColor: isEditing ? "var(--series-1)" : "var(--gridline)",
                background: isEditing ? "color-mix(in srgb, var(--series-1) 8%, var(--surface-1))" : "var(--surface-1)",
              }}
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  {entry.title} · {entry.company}
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {formatDate(entry.date)} · {formatCurrency(totalComp(entry), currency)}
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => onEdit(entry)}
                  className="text-xs font-medium"
                  style={{ color: isEditing ? "var(--series-1)" : "var(--text-secondary)" }}
                  aria-label={`Edit ${entry.title} at ${entry.company}`}
                >
                  {isEditing ? "Editing…" : "Edit"}
                </button>
                <button
                  onClick={() => onRemove(entry.id)}
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                  aria-label={`Remove ${entry.title} at ${entry.company}`}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
