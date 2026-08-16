"use client";

import {
  Bold,
  Check,
  Code,
  Eye,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  Maximize2,
  Pencil,
  Quote,
  Smile,
  X,
} from "lucide-react";
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
  /** Optional starter structure offered (via an "Insert template" button) only while the field is empty. */
  template?: string;
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
  template,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<Mode>("write");
  const [fullscreen, setFullscreen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const writeRef = useRef<HTMLTextAreaElement>(null);
  const fullscreenWriteRef = useRef<HTMLTextAreaElement>(null);
  const showTemplateButton = Boolean(template) && value.trim() === "";

  function insertTemplate() {
    if (!template) return;
    onChange(template);
    setMode("write");
  }

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
          <div className="flex items-center gap-2">
            {showTemplateButton && (
              <button
                type="button"
                onClick={insertTemplate}
                className="rounded-md border px-2 py-1 text-xs font-medium"
                style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
              >
                Insert template
              </button>
            )}
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
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>
                  Write
                </p>
                {showTemplateButton && (
                  <button
                    type="button"
                    onClick={insertTemplate}
                    className="rounded-md border px-2 py-1 text-xs font-medium"
                    style={{ borderColor: "var(--gridline)", color: "var(--text-secondary)" }}
                  >
                    Insert template
                  </button>
                )}
              </div>
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
      <span className="mx-1 h-4 w-px" style={{ background: "var(--gridline)" }} />
      <EmojiMenu textareaRef={textareaRef} value={value} onChange={onChange} />
    </div>
  );
}

interface EmojiEntry {
  emoji: string;
  name: string;
}

interface EmojiGroup {
  name: string;
  emojis: EmojiEntry[];
}

const PANEL_WIDTH = 256;
const PANEL_HEIGHT = 320;

// Lazy-loaded (dynamic import) so the ~400KB emoji dataset only ships to the
// client once someone actually opens the picker, and only fetched once per page.
let emojiGroupsPromise: Promise<EmojiGroup[]> | null = null;
function loadEmojiGroups(): Promise<EmojiGroup[]> {
  if (!emojiGroupsPromise) {
    emojiGroupsPromise = import("unicode-emoji-json/data-by-group.json").then(
      (mod) => (mod.default ?? mod) as unknown as EmojiGroup[]
    );
  }
  return emojiGroupsPromise;
}

function EmojiMenu({
  textareaRef,
  value,
  onChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<EmojiGroup[] | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    loadEmojiGroups().then(setGroups);

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const overflowsBottom = rect.bottom + PANEL_HEIGHT > window.innerHeight;
    setPosition({
      top: overflowsBottom ? Math.max(8, rect.top - PANEL_HEIGHT - 4) : rect.bottom + 4,
      left: Math.min(rect.left, window.innerWidth - PANEL_WIDTH - 8),
    });
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      close();
    }
    // Scroll events don't bubble, but a capture-phase listener on window still
    // sees them from any scrollable ancestor — used here to drop a
    // viewport-anchored popover instead of letting it drift out of place.
    // Scrolling the panel's own emoji list fires here too (its target is just
    // deeper in the capture path), so that case is excluded explicitly.
    function handleScroll(e: Event) {
      // e.target is the window itself for a plain page scroll, not a Node.
      if (e.target instanceof Node && panelRef.current?.contains(e.target)) return;
      close();
    }
    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  function insert(emoji: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.slice(0, start) + emoji + value.slice(end);
    onChange(newValue);
    close();

    requestAnimationFrame(() => {
      textarea.focus();
      const pos = start + emoji.length;
      textarea.setSelectionRange(pos, pos);
    });
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filtered =
    groups && normalizedQuery
      ? groups.flatMap((g) => g.emojis).filter((e) => e.name.includes(normalizedQuery))
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Insert emoji"
        title="Insert emoji"
        aria-haspopup="menu"
        aria-expanded={open}
        onMouseDown={(e) => {
          e.preventDefault();
          if (open) close();
          else setOpen(true);
        }}
        className="flex items-center justify-center rounded p-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        <Smile size={13} />
      </button>
      {open && position && (
        <div
          ref={panelRef}
          role="menu"
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: PANEL_WIDTH,
            borderColor: "var(--gridline)",
            background: "var(--surface-1)",
          }}
          className="z-50 flex flex-col gap-1.5 rounded-md border p-2 shadow-lg"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search emoji…"
            autoFocus
            className="input rounded px-2 py-1 text-xs"
          />
          <div className="max-h-56 overflow-y-auto">
            {!groups ? (
              <p className="p-2 text-xs" style={{ color: "var(--text-muted)" }}>
                Loading…
              </p>
            ) : filtered ? (
              filtered.length === 0 ? (
                <p className="p-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  No emoji found.
                </p>
              ) : (
                <div className="grid grid-cols-8 gap-0.5">
                  {filtered.map((entry) => (
                    <EmojiButton key={entry.emoji} entry={entry} onSelect={insert} />
                  ))}
                </div>
              )
            ) : (
              groups.map((group) => (
                <div key={group.name} className="mb-2">
                  <p
                    className="mb-1 px-0.5 text-[10px] font-semibold tracking-wide uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {group.name}
                  </p>
                  <div className="grid grid-cols-8 gap-0.5">
                    {group.emojis.map((entry) => (
                      <EmojiButton key={entry.emoji} entry={entry} onSelect={insert} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

function EmojiButton({ entry, onSelect }: { entry: EmojiEntry; onSelect: (emoji: string) => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      aria-label={`Insert ${entry.name}`}
      title={entry.name}
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect(entry.emoji);
      }}
      className="flex items-center justify-center rounded p-1 text-base"
    >
      {entry.emoji}
    </button>
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
