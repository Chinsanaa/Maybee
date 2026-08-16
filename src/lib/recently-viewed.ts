const STORAGE_KEY = "mb_recently_viewed";
const MAX_ITEMS = 8;

export function getRecentlyViewedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentlyViewedSlugs().filter((s) => s !== slug);
    const updated = [slug, ...existing].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable (private browsing, etc.) — silently no-op
  }
}
