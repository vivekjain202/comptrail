"use client";

import { Bold, Check, Code, Eye, Heading2, Italic, Link, List, ListOrdered, Maximize2, Pencil, Quote, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
  onDiscard?: () => void;
  hasChanges?: boolean;
}

type Mode = "write" | "preview";
type FormatType = "bold" | "italic" | "heading" | "link" | "ul" | "ol" | "quote" | "code";

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  onSave,
  onDiscard,
  hasChanges,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<Mode>("write");
  const [fullscreen, setFullscreen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const writeRef = useRef<HTMLTextAreaElement>(null);
  const fullscreenWriteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!fullscreen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFullscreen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [fullscreen]);

  function handleSave() {
    onSave?.();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-1" role="tablist">
            <TabButton active={mode === "write"} onClick={() => setMode("write")} icon={<Pencil size={12} />}>
              Write
            </TabButton>
            <TabButton active={mode === "preview"} onClick={() => setMode("preview")} icon={<Eye size={12} />}>
              Preview
            </TabButton>
          </div>
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="Open fullscreen editor"
            title="Open fullscreen editor (write and preview side by side)"
            className="flex items-center justify-center rounded-md border p-1.5"
            style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
          >
            <Maximize2 size={13} />
          </button>
        </div>

        {mode === "write" ? (
          <div className="flex flex-col gap-1">
            <Toolbar textareaRef={writeRef} value={value} onChange={onChange} />
            <textarea
              ref={writeRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={8}
              className="input resize-y rounded-t-none font-mono text-xs"
            />
          </div>
        ) : (
          <div
            className="min-h-[176px] rounded-md border p-3"
            style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
          >
            <MarkdownPreview value={value} />
          </div>
        )}

        {(onSave || onDiscard) && (
          <div className="flex items-center justify-end gap-2">
            {onDiscard && (
              <button
                type="button"
                onClick={onDiscard}
                disabled={!hasChanges}
                className="rounded-md border px-2.5 py-1 text-xs font-medium disabled:opacity-50"
                style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
              >
                Discard
              </button>
            )}
            {onSave && <SaveButton onClick={handleSave} disabled={!hasChanges} justSaved={justSaved} />}
          </div>
        )}
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--background)" }}>
          <div
            className="flex shrink-0 items-center justify-between border-b px-4 py-3"
            style={{ borderColor: "var(--gridline)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Career learnings
            </p>
            <div className="flex items-center gap-2">
              {onDiscard && (
                <button
                  type="button"
                  onClick={onDiscard}
                  disabled={!hasChanges}
                  className="rounded-md border px-2.5 py-1 text-xs font-medium disabled:opacity-50"
                  style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
                >
                  Discard
                </button>
              )}
              {onSave && <SaveButton onClick={handleSave} disabled={!hasChanges} justSaved={justSaved} />}
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Close fullscreen editor"
                className="flex items-center justify-center rounded-md border p-1.5"
                style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
            <div
              className="flex min-h-0 flex-col gap-2 border-b p-4 md:border-r md:border-b-0"
              style={{ borderColor: "var(--gridline)" }}
            >
              <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>
                Write
              </p>
              <Toolbar textareaRef={fullscreenWriteRef} value={value} onChange={onChange} />
              <textarea
                ref={fullscreenWriteRef}
                autoFocus
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="input flex-1 resize-none rounded-t-none font-mono text-xs"
              />
            </div>
            <div className="flex min-h-0 flex-col gap-2 overflow-y-auto p-4">
              <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>
                Preview
              </p>
              <MarkdownPreview value={value} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function applyFormat(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (value: string) => void,
  type: FormatType
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.slice(start, end);

  let insertion = "";
  let selectFrom = 0;
  let selectTo = 0;

  function wrap(marker: string, placeholder: string) {
    const text = selected || placeholder;
    insertion = `${marker}${text}${marker}`;
    selectFrom = marker.length;
    selectTo = selectFrom + text.length;
  }

  function linePrefix(prefix: (i: number) => string, placeholder: string) {
    const text = selected || placeholder;
    const lines = text.split("\n");
    insertion = lines.map((line, i) => `${prefix(i)}${line}`).join("\n");
    selectFrom = 0;
    selectTo = insertion.length;
  }

  switch (type) {
    case "bold":
      wrap("**", "bold text");
      break;
    case "italic":
      wrap("_", "italic text");
      break;
    case "heading":
      linePrefix(() => "## ", "Heading");
      break;
    case "link": {
      const text = selected || "link text";
      insertion = `[${text}](https://)`;
      selectFrom = insertion.length - "https://)".length;
      selectTo = insertion.length - 1;
      break;
    }
    case "ul":
      linePrefix(() => "- ", "List item");
      break;
    case "ol":
      linePrefix((i) => `${i + 1}. `, "List item");
      break;
    case "quote":
      linePrefix(() => "> ", "Quote");
      break;
    case "code": {
      const text = selected || "code";
      if (text.includes("\n")) {
        insertion = `\`\`\`\n${text}\n\`\`\``;
        selectFrom = 4;
        selectTo = selectFrom + text.length;
      } else {
        wrap("`", "code");
      }
      break;
    }
  }

  const newValue = value.slice(0, start) + insertion + value.slice(end);
  onChange(newValue);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start + selectFrom, start + selectTo);
  });
}

const TOOLBAR_ITEMS: { type: FormatType; icon: React.ReactNode; label: string }[] = [
  { type: "bold", icon: <Bold size={13} />, label: "Bold" },
  { type: "italic", icon: <Italic size={13} />, label: "Italic" },
  { type: "heading", icon: <Heading2 size={13} />, label: "Heading" },
  { type: "quote", icon: <Quote size={13} />, label: "Quote" },
  { type: "code", icon: <Code size={13} />, label: "Code" },
  { type: "link", icon: <Link size={13} />, label: "Link" },
  { type: "ul", icon: <List size={13} />, label: "Bulleted list" },
  { type: "ol", icon: <ListOrdered size={13} />, label: "Numbered list" },
];

function Toolbar({
  textareaRef,
  value,
  onChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-t-md border border-b-0 px-1.5 py-1"
      style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}
    >
      {TOOLBAR_ITEMS.map((item) => (
        <button
          key={item.type}
          type="button"
          aria-label={item.label}
          title={item.label}
          onMouseDown={(e) => {
            e.preventDefault();
            if (!textareaRef.current) return;
            applyFormat(textareaRef.current, value, onChange, item.type);
          }}
          className="flex items-center justify-center rounded p-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}

function SaveButton({
  onClick,
  disabled,
  justSaved,
}: {
  onClick: () => void;
  disabled: boolean;
  justSaved: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50"
      style={{ background: "var(--series-1)" }}
    >
      {justSaved ? (
        <>
          <Check size={12} /> Saved
        </>
      ) : (
        "Save changes"
      )}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
      style={{
        background: active ? "var(--surface-1)" : "transparent",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        border: `1px solid ${active ? "var(--gridline)" : "transparent"}`,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

export function MarkdownPreview({ value }: { value: string }) {
  if (!value.trim()) {
    return (
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Nothing to preview yet.
      </p>
    );
  }

  return (
    <div className="markdown-body text-sm" style={{ color: "var(--text-secondary)" }}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{value}</ReactMarkdown>
    </div>
  );
}
