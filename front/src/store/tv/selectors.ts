import { createSelector } from '@reduxjs/toolkit';

import {
  mapTmdbShowSummary,
  type ShowItem,
} from '~/components/ShowCard/helpers';
import { selectTrackedShows } from '~/store/rtk/slices/user.selectors';

import { type AppSelector, type AppState } from './..';
import { DISCOVER_CAROUSEL_KEYS, type DiscoverCarouselKey } from './actions';
import { type TmdbShowSummary } from './types/tmdbSchema';
import {
  type DiscoverShow,
  type ShowForDisplay,
  type TmdbShowWithSeasons,
} from './types/transformed';
import { mapShowInfoForDisplay } from './utils/formatting';

export const selectShowDetails = (state: AppState) => state.tv.showDetails;
export const selectSearchShowDetails = (state: AppState) =>
  state.tv.searchShowDetails;
export const selectIsLoadingShowDetails = (state: AppState) =>
  state.tv.isLoadingShowDetails;
export const selectCalendarEpisodesForDisplay = (state: AppState) =>
  state.tv.calendarEpisodesForDisplay;
export const selectIsLoadingCalendarEpisodes = (state: AppState) =>
  state.tv.isLoadingCalendarEpisodes;
export const selectDiscoverShows = (state: AppState) => state.tv.discoverShows;
export const selectRecommendations = (state: AppState) =>
  state.tv.recommendations;
export const selectForYouShows = (state: AppState) => state.tv.forYouShows;

const showDisplayCache = new WeakMap<TmdbShowWithSeasons, ShowForDisplay>();

const mapShowInfoForDisplayCached = (
  show: TmdbShowWithSeasons
): ShowForDisplay => {
  const cached = showDisplayCache.get(show);
  if (cached) {
    return cached;
  }

  const mapped = mapShowInfoForDisplay(show);
  showDisplayCache.set(show, mapped);
  return mapped;
};

export const selectTrackedShowsDetails: AppSelector<ShowForDisplay[]> =
  createSelector(
    selectShowDetails,
    selectTrackedShows,
    (showDetails, trackedShows) => {
      if (!showDetails || !trackedShows?.length) {
        return [];
      }

      const formattedTrackedShows: ShowForDisplay[] = [];
      for (const showId of trackedShows) {
        const show = showDetails[showId];
        if (show) {
          formattedTrackedShows.push(mapShowInfoForDisplayCached(show));
        }
      }

      return formattedTrackedShows.sort((a, b) => a.name.localeCompare(b.name));
    }
  );

type PartitionedTrackedShows = {
  activeSeason: ShowForDisplay[];
  inProduction: ShowForDisplay[];
  premieringSoon: ShowForDisplay[];
  ended: ShowForDisplay[];
};

const selectPartitionedTrackedShows: AppSelector<PartitionedTrackedShows> =
  createSelector(selectTrackedShowsDetails, shows => {
    const activeSeason: ShowForDisplay[] = [];
    const inProduction: ShowForDisplay[] = [];
    const premieringSoon: ShowForDisplay[] = [];
    const ended: ShowForDisplay[] = [];

    for (const show of shows) {
      if (show.status.isActiveSeason) {
        activeSeason.push(show);
      }
      if (show.status.isInProduction) {
        inProduction.push(show);
      }
      if (show.status.isPremieringSoon) {
        premieringSoon.push(show);
      }
      if (show.status.isEnded) {
        ended.push(show);
      }
    }

    return { activeSeason, inProduction, premieringSoon, ended };
  });

export const selectActiveSeasonShows: AppSelector<ShowForDisplay[]> =
  createSelector(selectPartitionedTrackedShows, p => p.activeSeason);

export const selectInProductionShows: AppSelector<ShowForDisplay[]> =
  createSelector(selectPartitionedTrackedShows, p => p.inProduction);

export const selectPremieringSoonShows: AppSelector<ShowForDisplay[]> =
  createSelector(selectPartitionedTrackedShows, p => p.premieringSoon);

export const selectEndedShows: AppSelector<ShowForDisplay[]> = createSelector(
  selectPartitionedTrackedShows,
  p => p.ended
);

const toDisplayFormat = (shows: TmdbShowSummary[]): DiscoverShow[] =>
  shows?.map(show => ({
    id: show.id,
    firstAirDate: show.first_air_date ?? null,
    name: show.name,
    overview: show.overview,
    posterPath: show.poster_path,
  })) ?? [];

export type DiscoverShowsForDisplay = Record<
  DiscoverCarouselKey,
  DiscoverShow[]
>;

export const selectDiscoverShowsForDisplay: AppSelector<DiscoverShowsForDisplay> =
  createSelector(selectDiscoverShows, discoverShows => {
    const result = {} as DiscoverShowsForDisplay;
    const seenIds = new Set<number>();

    for (const key of DISCOVER_CAROUSEL_KEYS) {
      const filtered = (discoverShows[key] ?? []).filter(
        show => !seenIds.has(show.id) && !!show.poster_path
      );
      result[key] = toDisplayFormat(filtered);
      filtered.slice(0, 4).forEach(show => seenIds.add(show.id));
    }

    return result;
  });

export const selectForYouShowsForDisplay: AppSelector<DiscoverShow[]> =
  createSelector(selectForYouShows, forYouShows =>
    toDisplayFormat(forYouShows.slice(0, 29).filter(show => !!show.poster_path))
  );

const selectCurrentShowId = (state: AppState) => state.tv.currentShowId;

export const selectCurrentShowInfo: AppSelector<ShowForDisplay | null> =
  createSelector(
    selectShowDetails,
    selectCurrentShowId,
    (showDetails, currentShowId) => {
      if (!currentShowId) {
        return null;
      }
      const currentShow = showDetails[currentShowId];
      return currentShow?.id ? mapShowInfoForDisplayCached(currentShow) : null;
    }
  );

export const selectCurrentSimilarShowItems: AppSelector<
  ShowItem[] | undefined
> = createSelector(
  [selectCurrentShowInfo, selectRecommendations],
  (showInfo, recommendations) => {
    const showId = showInfo?.id;
    if (!showId) {
      return undefined;
    }
    const similarShows = recommendations[showId];
    if (!similarShows) {
      return undefined;
    }
    return similarShows
      .map(mapTmdbShowSummary)
      .filter(show => show.id !== showId);
  }
);
