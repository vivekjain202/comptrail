"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  children: React.ReactNode;
}

export default function Collapsible({ title, defaultOpen = true, open, onToggle, children }: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  function toggle() {
    const next = !isOpen;
    if (isControlled) {
      onToggle?.(next);
    } else {
      setInternalOpen(next);
    }
  }

  return (
    <div className="rounded-lg border" style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h2>
        <ChevronDown
          size={16}
          style={{
            color: "var(--text-secondary)",
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 150ms ease",
            flexShrink: 0,
          }}
        />
      </button>
      {isOpen && <div className="flex flex-col gap-4 px-5 pb-5">{children}</div>}
    </div>
  );
}
