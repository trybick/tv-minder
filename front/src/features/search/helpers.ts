import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { type DiscoverFilters } from '~/store/tv/types/transformed';

/** Client-side filter search/discover results by DiscoverFilters criteria. */
export const applyFiltersToResults = (
  results: TmdbShowSummary[],
  filters: DiscoverFilters
): TmdbShowSummary[] => {
  let filtered = results;

  if (filters.genres?.length) {
    filtered = filtered.filter(show =>
      filters.genres!.some(genreId => show.genre_ids?.includes(genreId))
    );
  }

  if (filters.voteAverageGte && filters.voteAverageGte > 0) {
    filtered = filtered.filter(
      show => show.vote_average >= filters.voteAverageGte!
    );
  }

  if (filters.firstAirDateGte) {
    filtered = filtered.filter(
      show =>
        show.first_air_date && show.first_air_date >= filters.firstAirDateGte!
    );
  }

  if (filters.firstAirDateLte) {
    filtered = filtered.filter(
      show =>
        show.first_air_date && show.first_air_date <= filters.firstAirDateLte!
    );
  }

  if (filters.sortBy && filters.sortBy !== 'popularity.desc') {
    filtered = sortResults(filtered, filters.sortBy);
  }

  return filtered;
};

/** Client-side sort by a discover sort_by key. */
export const sortResults = (
  results: TmdbShowSummary[],
  sortBy: string
): TmdbShowSummary[] => {
  const sorted = [...results];
  switch (sortBy) {
    case 'popularity.desc':
      return sorted.sort((a, b) => b.popularity - a.popularity);
    case 'vote_average.desc':
      return sorted.sort((a, b) => b.vote_average - a.vote_average);
    case 'vote_count.desc':
      return sorted.sort((a, b) => b.vote_count - a.vote_count);
    case 'first_air_date.desc':
      return sorted.sort((a, b) =>
        (b.first_air_date || '').localeCompare(a.first_air_date || '')
      );
    case 'first_air_date.asc':
      return sorted.sort((a, b) =>
        (a.first_air_date || '').localeCompare(b.first_air_date || '')
      );
    default:
      return sorted;
  }
};

/**
 * Client-side text match: filters results where the show name
 * contains the query string (case-insensitive).
 */
export const filterByTextQuery = (
  results: TmdbShowSummary[],
  query: string
): TmdbShowSummary[] => {
  const q = query.toLowerCase().trim();
  if (!q) {
    return results;
  }
  return results.filter(
    show =>
      show.name.toLowerCase().includes(q) ||
      show.original_name.toLowerCase().includes(q)
  );
};

/** Count how many filters are actively set. */
export function countActiveFilters(filters: DiscoverFilters): number {
  let count = 0;
  if (filters.sortBy && filters.sortBy !== 'popularity.desc') {
    count++;
  }
  if (filters.genres?.length) {
    count++;
  }
  if (filters.voteAverageGte && filters.voteAverageGte > 0) {
    count++;
  }
  if (filters.firstAirDateGte) {
    count++;
  }
  if (filters.firstAirDateLte) {
    count++;
  }
  return count;
}
