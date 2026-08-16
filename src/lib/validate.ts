import { CompEntry, EntryType } from "./types";

const ENTRY_TYPES: EntryType[] = ["new_job", "promotion", "raise", "relocation"];
const MAX_ENTRIES = 100;

export interface TimelinePayload {
  title: string;
  note: string;
  learnings: string;
  currency: string;
  entries: CompEntry[];
}

export class ValidationError extends Error {}

export function parseTimelinePayload(body: unknown): TimelinePayload {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Invalid payload");
  }
  const b = body as Record<string, unknown>;

  const title = typeof b.title === "string" ? b.title.slice(0, 200) : "Salary Progression";
  const note = typeof b.note === "string" ? b.note.slice(0, 1000) : "";
  const learnings = typeof b.learnings === "string" ? b.learnings.slice(0, 10000) : "";
  const currency = typeof b.currency === "string" && /^[A-Z]{3}$/.test(b.currency) ? b.currency : "USD";

  if (!Array.isArray(b.entries)) {
    throw new ValidationError("entries must be an array");
  }
  if (b.entries.length > MAX_ENTRIES) {
    throw new ValidationError(`entries cannot exceed ${MAX_ENTRIES}`);
  }

  const entries: CompEntry[] = b.entries.map((raw, i) => {
    if (typeof raw !== "object" || raw === null) {
      throw new ValidationError(`Invalid entry at index ${i}`);
    }
    const e = raw as Record<string, unknown>;

    const date = typeof e.date === "string" ? e.date : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new ValidationError(`Invalid date at index ${i}`);
    }

    const type = ENTRY_TYPES.includes(e.type as EntryType) ? (e.type as EntryType) : "raise";

    return {
      id: typeof e.id === "string" && e.id ? e.id.slice(0, 100) : `entry-${i}`,
      date,
      company: typeof e.company === "string" ? e.company.slice(0, 200) : "",
      title: typeof e.title === "string" ? e.title.slice(0, 200) : "",
      level: typeof e.level === "string" ? e.level.slice(0, 100) : "",
      type,
      base: typeof e.base === "number" && Number.isFinite(e.base) ? Math.max(0, e.base) : 0,
      bonus: typeof e.bonus === "number" && Number.isFinite(e.bonus) ? Math.max(0, e.bonus) : 0,
      equity: typeof e.equity === "number" && Number.isFinite(e.equity) ? Math.max(0, e.equity) : 0,
      note: typeof e.note === "string" ? e.note.slice(0, 500) : "",
    };
  });

  return { title, note, learnings, currency, entries };
}
