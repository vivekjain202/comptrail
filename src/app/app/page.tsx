"use client";

import { House } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CardDetailsForm from "@/components/CardDetailsForm";
import Collapsible from "@/components/Collapsible";
import EntryForm from "@/components/EntryForm";
import EntryManagerList from "@/components/EntryManagerList";
import Footer from "@/components/Footer";
import MilestoneChart from "@/components/MilestoneChart";
import PreviewExport from "@/components/PreviewExport";
import SharePanel from "@/components/SharePanel";
import StatsCards from "@/components/StatsCards";
import ThemeToggle from "@/components/ThemeToggle";
import TimelineView from "@/components/TimelineView";
import { getEditToken, saveEditToken } from "@/lib/local-store";
import { CompEntry } from "@/lib/types";

type MobileTab = "manage" | "preview";

export default function Home() {
  const [entries, setEntries] = useState<CompEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("manage");
  const [cardTitle, setCardTitle] = useState("Salary Progression");
  const [timelineNote, setTimelineNote] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [entryFormOpen, setEntryFormOpen] = useState(true);

  const [ownedSlug, setOwnedSlug] = useState<string | null>(null);
  const [ownedEditToken, setOwnedEditToken] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const editingEntry = entries.find((e) => e.id === editingId) ?? null;

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("slug");
    if (!slug) return;

    fetch(`/api/timelines/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { title: string; note: string; currency: string; entries: CompEntry[] } | null) => {
        if (!data) return;
        setEntries(data.entries);
        setCardTitle(data.title);
        setTimelineNote(data.note);
        setCurrency(data.currency);

        const token = getEditToken(slug);
        if (token) {
          setOwnedSlug(slug);
          setOwnedEditToken(token);
        }
      })
      .catch(() => {});
  }, []);

  function handleSave(entry: CompEntry) {
    setEntries((prev) =>
      prev.some((e) => e.id === entry.id)
        ? prev.map((e) => (e.id === entry.id ? entry : e))
        : [...prev, entry]
    );
    setEditingId(null);
  }

  function handleRemove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function handleEdit(entry: CompEntry) {
    setEditingId(entry.id);
    setMobileTab("manage");
    setEntryFormOpen(true);
  }

  async function handleShareSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const body = { title: cardTitle, note: timelineNote, currency, entries };
      const res =
        ownedSlug && ownedEditToken
          ? await fetch(`/api/timelines/${ownedSlug}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...body, editToken: ownedEditToken }),
            })
          : await fetch("/api/timelines", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save");
      }

      const data = await res.json();
      if (!ownedSlug) {
        saveEditToken(data.slug, data.editToken);
        setOwnedSlug(data.slug);
        setOwnedEditToken(data.editToken);
        window.history.replaceState(null, "", `/app?slug=${data.slug}`);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <header
        className="shrink-0 border-b px-6 py-4"
        style={{ borderColor: "var(--gridline)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Salary Progression
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Build your career timeline and see it as a shareable progression chart.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label="Back to homepage"
              className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
              style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
            >
              <House size={16} />
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-3 flex gap-1 lg:hidden" role="tablist">
          <TabButton active={mobileTab === "manage"} onClick={() => setMobileTab("manage")}>
            Manage
          </TabButton>
          <TabButton active={mobileTab === "preview"} onClick={() => setMobileTab("preview")}>
            Preview
          </TabButton>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[400px_1fr]">
        <section
          className={`min-h-0 flex-col gap-4 overflow-y-auto px-6 py-6 ${
            mobileTab === "manage" ? "flex" : "hidden"
          } lg:flex`}
        >
          <h2 className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>
            Manage
          </h2>
          <SharePanel slug={ownedSlug} saving={saving} error={saveError} onSave={handleShareSave} />
          <Collapsible title="Card details" defaultOpen={false}>
            <CardDetailsForm
              title={cardTitle}
              note={timelineNote}
              currency={currency}
              onTitleChange={setCardTitle}
              onNoteChange={setTimelineNote}
              onCurrencyChange={setCurrency}
            />
          </Collapsible>

          <Collapsible
            title={editingEntry ? "Edit career event" : "Add a career event"}
            open={entryFormOpen}
            onToggle={setEntryFormOpen}
          >
            <EntryForm onAdd={handleSave} editingEntry={editingEntry} onCancelEdit={() => setEditingId(null)} />
          </Collapsible>

          <EntryManagerList
            entries={entries}
            currency={currency}
            onEdit={handleEdit}
            onRemove={handleRemove}
            editingId={editingId}
          />
        </section>

        <section
          className={`min-h-0 flex-col gap-4 overflow-y-auto border-t px-6 py-6 lg:border-t-0 lg:border-l ${
            mobileTab === "preview" ? "flex" : "hidden"
          } lg:flex`}
          style={{ borderColor: "var(--gridline)" }}
        >
          <h2 className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>
            Preview
          </h2>
          <div className="pb-6">
            <PreviewExport filename={`${cardTitle}-full-preview`}>
              <StatsCards entries={entries} currency={currency} />
              <MilestoneChart
                entries={entries}
                currency={currency}
                title={cardTitle}
                note={timelineNote}
                slug={ownedSlug}
              />
              <TimelineView entries={entries} currency={currency} title={cardTitle} slug={ownedSlug} />
            </PreviewExport>
          </div>
          <Footer />
        </section>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
      style={{
        background: active ? "var(--series-1)" : "transparent",
        color: active ? "#ffffff" : "var(--text-secondary)",
      }}
    >
      {children}
    </button>
  );
}
