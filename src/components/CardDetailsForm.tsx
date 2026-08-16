"use client";

import { useId } from "react";
import { CURRENCIES } from "@/lib/currencies";

interface CardDetailsFormProps {
  title: string;
  note: string;
  currency: string;
  onTitleChange: (title: string) => void;
  onNoteChange: (note: string) => void;
  onCurrencyChange: (currency: string) => void;
}

export default function CardDetailsForm({
  title,
  note,
  currency,
  onTitleChange,
  onNoteChange,
  onCurrencyChange,
}: CardDetailsFormProps) {
  const formId = useId();

  return (
    <>
      <label htmlFor={`${formId}-title`} className="flex flex-col gap-1 text-xs">
        <span style={{ color: "var(--text-secondary)" }}>Card title</span>
        <input
          id={`${formId}-title`}
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="input"
        />
      </label>

      <label htmlFor={`${formId}-currency`} className="flex flex-col gap-1 text-xs">
        <span style={{ color: "var(--text-secondary)" }}>Currency</span>
        <select
          id={`${formId}-currency`}
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="input"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor={`${formId}-note`} className="flex flex-col gap-1 text-xs">
        <span style={{ color: "var(--text-secondary)" }}>Overall note (optional)</span>
        <textarea
          id={`${formId}-note`}
          rows={2}
          placeholder="e.g. Appraisal delays in 2023 (7 months) and 2025 (8 months) impacted the timeline."
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          className="input resize-none"
        />
      </label>
    </>
  );
}
