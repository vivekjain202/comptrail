"use client";

import { Download, FileText, Loader2, MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { downloadElementAsPdf, downloadElementAsPng } from "@/lib/export";

interface ExportMenuProps {
  getNode: () => HTMLElement | null;
  filename: string;
  label: string;
}

export default function ExportMenu({ getNode, filename, label }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<"png" | "pdf" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handle(kind: "png" | "pdf") {
    const node = getNode();
    if (!node || busy) return;
    setBusy(kind);
    try {
      if (kind === "png") {
        await downloadElementAsPng(node, filename);
      } else {
        await downloadElementAsPdf(node, filename);
      }
    } finally {
      setBusy(null);
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Download options for ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center justify-center rounded-md border p-1.5"
        style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)", background: "var(--surface-1)" }}
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 z-10 mt-1 w-44 overflow-hidden rounded-md border py-1 text-xs shadow-lg"
          style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handle("png")}
            disabled={busy !== null}
            className="flex w-full items-center gap-2 px-3 py-2 text-left transition-opacity hover:opacity-70 disabled:opacity-60"
            style={{ color: "var(--text-secondary)" }}
          >
            {busy === "png" ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            Download as image
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handle("pdf")}
            disabled={busy !== null}
            className="flex w-full items-center gap-2 px-3 py-2 text-left transition-opacity hover:opacity-70 disabled:opacity-60"
            style={{ color: "var(--text-secondary)" }}
          >
            {busy === "pdf" ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}
