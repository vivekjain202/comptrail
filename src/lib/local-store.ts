const PREFIX = "comptrail:timeline:";
// Renamed from "salary-progression:timeline:" — kept as a read fallback so
// tokens saved by existing users under the old key aren't silently lost.
const LEGACY_PREFIX = "salary-progression:timeline:";

export function saveEditToken(slug: string, editToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PREFIX}${slug}`, editToken);
}

export function getEditToken(slug: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${PREFIX}${slug}`) ?? localStorage.getItem(`${LEGACY_PREFIX}${slug}`);
}
