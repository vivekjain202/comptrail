"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getEditToken } from "@/lib/local-store";

interface PublicPageActionsProps {
  slug: string;
  viewCount: number;
}

export default function PublicPageActions({ slug, viewCount }: PublicPageActionsProps) {
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    setCanEdit(getEditToken(slug) !== null);
  }, [slug]);

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
      style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
    >
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        A shared salary progression timeline.
      </p>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
          <Eye size={12} /> {viewCount} {viewCount === 1 ? "view" : "views"}
        </span>
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
