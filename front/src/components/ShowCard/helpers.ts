import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { type ShowStatus } from '~/store/tv/utils/formatting';

/**
 * Normalized show item used by ShowCard compound components.
 */
export type ShowItem = {
  id: number;
  name: string;
  posterPath: string | null | undefined;
  firstAirDate: string | null | undefined;
  overview?: string;
  status?: ShowStatus | null;
};

// TmdbShowSummary -> ShowItem (snake_case to camelCase conversion required)
export const mapTmdbShowSummary = (show: TmdbShowSummary): ShowItem => ({
  id: show.id,
  name: show.name,
  posterPath: show.poster_path,
  firstAirDate: show.first_air_date,
  overview: show.overview,
});

export type StatusBadge = { label: string; color: string };

export const getStatusBadge = (
  status?: ShowStatus | null
): StatusBadge | null => {
  if (!status) {
    return null;
  }
  if (status.isActiveSeason) {
    return { label: 'Airing Now', color: 'green.500' };
  }
  if (status.isPremieringSoon) {
    return { label: 'Premiering Soon', color: 'purple.500' };
  }
  return null;
};
