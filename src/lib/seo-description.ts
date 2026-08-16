import { computeStats } from "./calculations";
import { CompEntry } from "./types";

// Long enough on its own (126 chars) that appending it to even a very short
// base still clears the 120-char meta-description minimum.
const LONG_PITCH =
  "Built with Salary Progression, a free tool to track and share how your compensation has grown over time — no account required.";
const SHORT_PITCH = "Built with Salary Progression — track and share your career growth.";

// Search engines and social platforms recommend different lengths for the plain
// meta description (~120-160 chars) vs. the og/twitter card description
// (~80-125 chars). Pad the base sentence with a pitch sized for that specific
// target rather than truncating one shared string, so it doesn't cut off mid-word.
function fitDescription(base: string, min: number, max: number, pitch: string): string {
  const padded = base.length < min ? `${base} ${pitch}` : base;
  return padded.length > max ? `${padded.slice(0, max - 1).trimEnd()}…` : padded;
}

export function buildTimelineDescriptions(
  title: string,
  note: string,
  entries: CompEntry[]
): { meta: string; social: string } {
  const stats = computeStats(entries);
  const n = entries.length;

  let base = note.trim();
  if (!base) {
    if (n > 0) {
      const years = Math.max(1, Math.round(stats.yearsSpanned));
      const yearsPart = `${years} year${years === 1 ? "" : "s"}`;
      // Extreme percentages (common with placeholder/test data using tiny base
      // values) read as broken rather than compelling, so we drop the clause
      // instead of showing something like "up 866586%".
      const growthPart =
        stats.totalGrowthPct !== null && Math.abs(stats.totalGrowthPct) <= 1000
          ? ` with ${Math.max(0, Math.round(stats.totalGrowthPct))}% total growth`
          : "";
      base = `${title}: ${n} career event${n === 1 ? "" : "s"} tracked over ${yearsPart}${growthPart}.`;
    } else {
      base = `${title}: a salary progression timeline.`;
    }
  }

  return {
    meta: fitDescription(base, 120, 160, LONG_PITCH),
    social: fitDescription(base, 80, 125, SHORT_PITCH),
  };
}
