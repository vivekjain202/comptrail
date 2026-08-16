"use client";

import { Check, CircleAlert, Copy, ExternalLink, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SharePanelProps {
  slug: string | null;
  viewCount?: number | null;
  saving: boolean;
  error: string | null;
  hasUnsavedChanges?: boolean;
  onSave: () => void;
}

export default function SharePanel({
  slug,
  viewCount,
  saving,
  error,
  hasUnsavedChanges,
  onSave,
}: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/t/${slug}` : null;

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-5" style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Share
        </h2>
        <button
          onClick={onSave}
          disabled={saving}
          className="relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          style={{ background: "var(--series-1)" }}
        >
          {saving && <Loader2 size={12} className="animate-spin" />}
          {slug ? "Update link" : "Save & get link"}
          {hasUnsavedChanges && !saving && (
            <span
              className="absolute -top-1 -right-1 h-2.5 w-2.5 animate-pulse rounded-full ring-2"
              style={{ background: "var(--series-2)", "--tw-ring-color": "var(--surface-1)" } as React.CSSProperties}
            />
          )}
        </button>
      </div>

      {hasUnsavedChanges && (
        <p className="flex items-center gap-1.5 text-xs" style={{ color: "var(--series-2)" }}>
          <CircleAlert size={13} /> You have unsaved changes — click &ldquo;Update link&rdquo; to make them visible
          to anyone with your link.
        </p>
      )}

      {error && (
        <p className="text-xs" style={{ color: "var(--series-2)" }}>
          {error}
        </p>
      )}

      {shareUrl && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input readOnly value={shareUrl} onFocus={(e) => e.target.select()} className="input flex-1" />
            <button
              onClick={handleCopy}
              aria-label="Copy link"
              className="flex shrink-0 items-center gap-1 rounded-md border px-2 py-1.5 text-xs"
              style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href={`/t/${slug}`}
              target="_blank"
              className="flex items-center gap-1 font-medium"
              style={{ color: "var(--series-1)" }}
            >
              <ExternalLink size={12} /> View public page
            </Link>
            {typeof viewCount === "number" && (
              <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <Eye size={12} /> {viewCount} {viewCount === 1 ? "view" : "views"}
              </span>
            )}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Use the PNG/PDF buttons on the chart, timeline, or full preview to download images that match what you
            see here.
          </p>
        </div>
      )}
    </div>
  );
}
