export type EntryType = "new_job" | "promotion" | "raise" | "relocation";

export interface CompEntry {
  id: string;
  date: string; // ISO yyyy-mm-dd
  company: string;
  title: string;
  level: string;
  type: EntryType;
  base: number;
  bonus: number;
  equity: number;
  note: string;
}

export const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  new_job: "New job",
  promotion: "Promotion",
  raise: "Raise",
  relocation: "Relocation",
};
