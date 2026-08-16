import { formatCurrency, totalComp } from "@/lib/calculations";
import { CompEntry } from "@/lib/types";

export default function CompBreakdownTooltip({ entry, currency }: { entry: CompEntry; currency: string }) {
  return (
    <div className="w-max min-w-[150px] text-xs">
      <p className="mb-1.5 font-semibold" style={{ color: "var(--text-primary)" }}>
        {entry.title}
      </p>
      <div className="flex flex-col gap-1">
        <Row label="Base" value={entry.base} currency={currency} />
        <Row label="Bonus" value={entry.bonus} currency={currency} />
        <Row label="Equity" value={entry.equity} currency={currency} />
      </div>
      <div
        className="mt-1.5 flex items-center justify-between gap-4 border-t pt-1.5 font-semibold"
        style={{ borderColor: "var(--gridline)", color: "var(--text-primary)" }}
      >
        <span>Total</span>
        <span>{formatCurrency(totalComp(entry), currency)}</span>
      </div>
    </div>
  );
}

function Row({ label, value, currency }: { label: string; value: number; currency: string }) {
  return (
    <div className="flex items-center justify-between gap-4" style={{ color: "var(--text-secondary)" }}>
      <span>{label}</span>
      <span>{formatCurrency(value, currency)}</span>
    </div>
  );
}
