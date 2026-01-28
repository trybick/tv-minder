const RECENT_SHOWS_KEY = 'tv-minder-recent-shows';
const MAX_RECENT_SHOWS = 8;

type RecentShow = {
  id: number;
  name: string;
  posterPath: string | null;
  visitedAt: number;
};

export const getRecentShows = (): RecentShow[] => {
  try {
    const stored = localStorage.getItem(RECENT_SHOWS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addRecentShow = (show: Omit<RecentShow, 'visitedAt'>): void => {
  try {
    const recent = getRecentShows();
    // Remove if already exists
    const filtered = recent.filter(s => s.id !== show.id);
    // Add to front with timestamp
    const updated = [
      { ...show, visitedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_RECENT_SHOWS);
    localStorage.setItem(RECENT_SHOWS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
};

export const clearRecentShows = (): void => {
  try {
    localStorage.removeItem(RECENT_SHOWS_KEY);
  } catch {
    // Ignore
  }
};
