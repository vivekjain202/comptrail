"use client";

import { Check, Copy, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getEditToken } from "@/lib/local-store";

interface PublicPageActionsProps {
  slug: string;
  viewCount: number;
}

export default function PublicPageActions({ slug, viewCount }: PublicPageActionsProps) {
  const [canEdit, setCanEdit] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanEdit(getEditToken(slug) !== null);
  }, [slug]);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
      style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
    >
      <p className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        A shared salary progression timeline.
        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
          <Eye size={12} /> {viewCount} {viewCount === 1 ? "view" : "views"}
        </span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium"
          style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy link"}
        </button>
        {canEdit && (
          <Link
            href={`/app?slug=${slug}`}
            className="flex items-center rounded-md px-3 py-1.5 text-xs font-semibold text-white"
            style={{ background: "var(--series-1)" }}
          >
            Edit
          </Link>
        )}
      </div>
    </div>
  );
}
