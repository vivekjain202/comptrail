"use client";

import { useEffect, useId, useState } from "react";
import { CompEntry, ENTRY_TYPE_LABELS, EntryType } from "@/lib/types";

interface EntryFormProps {
  onAdd: (entry: CompEntry) => void;
  editingEntry: CompEntry | null;
  onCancelEdit: () => void;
}

const emptyForm = {
  date: "",
  company: "",
  title: "",
  level: "",
  type: "new_job" as EntryType,
  base: "",
  bonus: "",
  equity: "",
  note: "",
};

function toForm(entry: CompEntry) {
  return {
    date: entry.date,
    company: entry.company,
    title: entry.title,
    level: entry.level,
    type: entry.type,
    base: String(entry.base),
    bonus: entry.bonus ? String(entry.bonus) : "",
    equity: entry.equity ? String(entry.equity) : "",
    note: entry.note ?? "",
  };
}

export default function EntryForm({ onAdd, editingEntry, onCancelEdit }: EntryFormProps) {
  const formId = useId();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(editingEntry ? toForm(editingEntry) : emptyForm);
  }, [editingEntry]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.company || !form.title || !form.base) return;

    onAdd({
      id: editingEntry?.id ?? crypto.randomUUID(),
      date: form.date,
      company: form.company,
      title: form.title,
      level: form.level,
      type: form.type,
      base: Number(form.base) || 0,
      bonus: Number(form.bonus) || 0,
      equity: Number(form.equity) || 0,
      note: form.note.trim(),
    });

    setForm(emptyForm);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date" htmlFor={`${formId}-date`}>
          <input
            id={`${formId}-date`}
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Event type" htmlFor={`${formId}-type`}>
          <select
            id={`${formId}-type`}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as EntryType })}
            className="input"
          >
            {Object.entries(ENTRY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Company" htmlFor={`${formId}-company`}>
          <input
            id={`${formId}-company`}
            type="text"
            required
            placeholder="Company A"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Title" htmlFor={`${formId}-title`}>
          <input
            id={`${formId}-title`}
            type="text"
            required
            placeholder="Software Engineer"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Level (optional)" htmlFor={`${formId}-level`}>
          <input
            id={`${formId}-level`}
            type="text"
            placeholder="L4 / Senior"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Base salary" htmlFor={`${formId}-base`}>
          <input
            id={`${formId}-base`}
            type="number"
            required
            min={0}
            placeholder="120000"
            value={form.base}
            onChange={(e) => setForm({ ...form, base: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Bonus (optional)" htmlFor={`${formId}-bonus`}>
          <input
            id={`${formId}-bonus`}
            type="number"
            min={0}
            placeholder="0"
            value={form.bonus}
            onChange={(e) => setForm({ ...form, bonus: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Equity/yr (optional)" htmlFor={`${formId}-equity`}>
          <input
            id={`${formId}-equity`}
            type="number"
            min={0}
            placeholder="0"
            value={form.equity}
            onChange={(e) => setForm({ ...form, equity: e.target.value })}
            className="input"
          />
        </Field>
      </div>

      <Field label="Note (optional)" htmlFor={`${formId}-note`}>
        <textarea
          id={`${formId}-note`}
          rows={2}
          placeholder="e.g. Promoted to Senior, 8 month appraisal delay"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="input resize-none"
        />
      </Field>

      <div className="mt-1 flex gap-2">
        <button
          type="submit"
          className="rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--series-1)" }}
        >
          {editingEntry ? "Save changes" : "Add to timeline"}
        </button>
        {editingEntry && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border px-4 py-2 text-sm font-medium"
            style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1 text-xs">
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      {children}
    </label>
  );
}
