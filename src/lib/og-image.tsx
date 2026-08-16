import { ImageResponse } from "next/og";
import { CompEntry, EntryType } from "./types";
import { formatCompact, sortByDate, totalComp } from "./calculations";

const WIDTH = 1200;
const HEIGHT = 630;
const MAX_BARS = 8;
const BAR_AREA_HEIGHT = 260;
const MIN_BAR_HEIGHT = 24;

function colorForType(type: EntryType): string {
  if (type === "promotion") return "#0ca30c";
  if (type === "relocation") return "#eb6834";
  return "#2a78d6";
}

export function renderTimelineImage(params: {
  title: string;
  note: string;
  currency: string;
  entries: CompEntry[];
}) {
  const { title, note, currency, entries } = params;
  const sorted = sortByDate(entries);
  const shown = sorted.slice(-MAX_BARS);

  const values = shown.map(totalComp);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = max - min || 1;

  const years = sorted.map((e) => new Date(e.date).getFullYear());
  const yearRange =
    years.length === 0
      ? ""
      : Math.min(...years) === Math.max(...years)
        ? `${Math.min(...years)}`
        : `${Math.min(...years)} – ${Math.max(...years)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fcfcfb",
          padding: 64,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: -1,
              textTransform: "uppercase",
              color: "#0b0b0b",
              display: "flex",
            }}
          >
            {title || "Salary Progression"}
          </div>
          {yearRange && (
            <div style={{ fontSize: 20, color: "#52514e", marginTop: 8, display: "flex" }}>{yearRange}</div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 24,
            marginTop: 32,
          }}
        >
          {shown.map((entry) => {
            const value = totalComp(entry);
            const color = colorForType(entry.type);
            const barHeight = MIN_BAR_HEIGHT + ((value - min) / range) * (BAR_AREA_HEIGHT - MIN_BAR_HEIGHT);
            const dateLabel = new Date(entry.date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  width: 108,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    color: "#ffffff",
                    background: color,
                    fontSize: 16,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 8,
                    marginBottom: 10,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatCompact(value, currency)}
                </div>
                <div
                  style={{
                    display: "flex",
                    width: 40,
                    height: barHeight,
                    background: color,
                    borderRadius: "8px 8px 0 0",
                  }}
                />
                <div style={{ display: "flex", fontSize: 14, fontWeight: 600, color: "#52514e", marginTop: 10 }}>
                  {dateLabel}
                </div>
              </div>
            );
          })}
        </div>

        {note.trim() && (
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#0b0b0b",
              background: "rgba(42, 120, 214, 0.08)",
              border: "2px dashed #2a78d6",
              borderRadius: 10,
              padding: "14px 20px",
              marginTop: 24,
            }}
          >
            {note.length > 140 ? `${note.slice(0, 140)}…` : note}
          </div>
        )}
      </div>
    ),
    { width: WIDTH, height: HEIGHT }
  );
}
