"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

interface SectionShareButtonProps {
  /** Slug of the saved, publicly shareable timeline — omit/null if not saved yet. */
  slug?: string | null;
  /** DOM id of this section on the public page, used as the share link's #hash. */
  anchor: string;
}

export default function SectionShareButton({ slug, anchor }: SectionShareButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    if (!slug) return;
    const url = `${window.location.origin}/t/${slug}#${anchor}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!slug}
      title={slug ? "Copy link to this section" : "Save your timeline first to get a shareable link"}
      aria-label="Copy link to this section"
      className="flex items-center justify-center rounded-md border p-1.5 disabled:opacity-40"
      style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)", background: "var(--surface-1)" }}
    >
      {copied ? <Check size={14} /> : <Link2 size={14} />}
    </button>
  );
}
