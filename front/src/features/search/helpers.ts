import { type DiscoverFilters } from '~/store/tv/types/transformed';

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
