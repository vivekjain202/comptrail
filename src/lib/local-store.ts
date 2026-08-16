const PREFIX = "salary-progression:timeline:";

export function saveEditToken(slug: string, editToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PREFIX}${slug}`, editToken);
}

export function getEditToken(slug: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${PREFIX}${slug}`);
}
