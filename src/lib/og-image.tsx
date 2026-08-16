import { ImageResponse } from "next/og";
import { CompEntry, EntryType } from "./types";
import { formatCompact, sortByDate, totalComp } from "./calculations";

// Rendered at 2x the nominal 1200x630 OG size. Social crawlers (LinkedIn in
// particular) re-compress/re-scale preview images quite aggressively, and a
// higher native resolution source holds up much better than exactly the
// minimum size — the declared og:image dimensions below are scaled to match.
const SCALE = 2;
const WIDTH = 1200 * SCALE;
const HEIGHT = 630 * SCALE;
const MAX_POINTS = 8;
const CHART_HEIGHT = 410 * SCALE;
const CHART_TOP_PCT = 38;
const CHART_BOTTOM_PCT = 10;
const DOT_SIZE = 18 * SCALE;
const DOT_RADIUS = DOT_SIZE / 2;

const STATUS_GOOD = "#0ca30c";
const SERIES_2 = "#d95926";
const SERIES_1 = "#3987e5";

function colorForType(type: EntryType): string {
  if (type === "promotion") return STATUS_GOOD;
  if (type === "relocation") return SERIES_2;
  return SERIES_1;
}

// Plain inline SVGs (not lucide-react components) — Satori's JSX renderer has no
// active hook dispatcher, and lucide-react icons use a context hook internally.
type IconProps = { size: number; color: string };

function StarIcon({ size, color }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

function MapPinIcon({ size, color }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BriefcaseIcon({ size, color }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}

const TYPE_ICON: Partial<Record<EntryType, (props: IconProps) => React.JSX.Element>> = {
  promotion: StarIcon,
  relocation: MapPinIcon,
  new_job: BriefcaseIcon,
};

export function renderTimelineImage(params: {
  title: string;
  note: string;
  currency: string;
  entries: CompEntry[];
}) {
  const { currency, entries } = params;
  const sorted = sortByDate(entries);
  const shown = sorted.slice(-MAX_POINTS);
  const n = shown.length;

  const values = shown.map(totalComp);
  const logValues = values.map((v) => Math.log(Math.max(v, 1)));
  const minLog = n > 0 ? Math.min(...logValues) : 0;
  const maxLog = n > 0 ? Math.max(...logValues) : 0;
  const rangeLog = maxLog - minLog || 1;

  const points = shown.map((entry, i) => {
    const value = totalComp(entry);
    const logValue = Math.log(Math.max(value, 1));
    const x = n === 1 ? 50 : ((i + 0.5) / n) * 100;
    const y = CHART_TOP_PCT + (1 - (logValue - minLog) / rangeLog) * (100 - CHART_TOP_PCT - CHART_BOTTOM_PCT);
    return {
      entry,
      value,
      x,
      y,
      color: colorForType(entry.type),
      Icon: TYPE_ICON[entry.type],
      dateLabel: new Date(entry.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: "#1a1a19",
          paddingTop: 48 * SCALE,
          paddingLeft: 48 * SCALE,
          paddingRight: 48 * SCALE,
          paddingBottom: 88 * SCALE,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {n === 0 ? (
          <div style={{ display: "flex", fontSize: 28 * SCALE, color: "#898781" }}>No career events yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <div style={{ position: "relative", display: "flex", width: "100%", height: CHART_HEIGHT }}>
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              >
                <polyline points={polylinePoints} fill="none" stroke={SERIES_1} strokeWidth={0.6} />
              </svg>

              {points.map((p) => {
                const Icon = p.Icon;
                const connectorHeight = Math.max(CHART_HEIGHT * (1 - p.y / 100) - DOT_RADIUS, 0);

                return (
                  <div
                    key={p.entry.id}
                    style={{
                      position: "absolute",
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      display: "flex",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                        borderRadius: 999,
                        background: p.color,
                        border: `${3 * SCALE}px solid #1a1a19`,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        position: "absolute",
                        top: DOT_SIZE,
                        left: "50%",
                        width: 0,
                        height: connectorHeight,
                        borderLeft: `${2.5 * SCALE}px dashed #383835`,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        position: "absolute",
                        bottom: DOT_SIZE + 12 * SCALE,
                        left: "50%",
                        transform: "translateX(-50%)",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6 * SCALE,
                      }}
                    >
                      {Icon && <Icon size={26 * SCALE} color={p.color} />}
                      <div
                        style={{
                          display: "flex",
                          color: "#ffffff",
                          background: p.color,
                          fontSize: 24 * SCALE,
                          fontWeight: 700,
                          padding: `${8 * SCALE}px ${16 * SCALE}px`,
                          borderRadius: 10 * SCALE,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatCompact(p.value, currency)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "row", marginTop: 24 * SCALE }}>
              {points.map((p) => (
                <div
                  key={p.entry.id}
                  style={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                    fontSize: 22 * SCALE,
                    fontWeight: 600,
                    color: "#ffffff",
                  }}
                >
                  {p.dateLabel}
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 28 * SCALE,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            gap: 8 * SCALE,
            fontSize: 20 * SCALE,
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          <span style={{ display: "flex" }}>View the full salary progression</span>
          <span style={{ display: "flex", color: SERIES_1 }}>→</span>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT }
  );
}
