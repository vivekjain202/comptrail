"use client";

import { Check, Copy, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getEditToken } from "@/lib/local-store";

export default function PublicPageActions({ slug }: { slug: string }) {
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
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        A shared salary progression timeline.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium"
          style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy link"}
        </button>
        <a
          href={`/api/timelines/${slug}/image`}
          download={`${slug}.png`}
          className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium"
          style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
        >
          <Download size={14} /> Download image
        </a>
        {canEdit && (
          <Link
            href={`/?slug=${slug}`}
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
