import { ShowStatus } from '~/store/tv/utils/formatting';

import { TmdbSeason, TmdbShow, TmdbShowSummary } from './tmdbSchema';

export type EpisodeForDisplay = {
  airDate: string;
  episodeNumber: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type EpisodeForSeason = {
  airDate: string | null;
  episodeNumber: number;
  name: string;
  voteAverage: string;
};

export type SeasonWithEpisodes = {
  airDate: string | null;
  episodes: EpisodeForSeason[];
  id: number;
  isSpecialsSeason: boolean;
  name: string;
  nameForDisplay: string;
  overview: string;
  posterPath: string | null;
  seasonNumber: number;
};

export type ShowForDisplay = {
  backdropPath: string | null;
  episodeRunTime: number | undefined;
  firstAirDate: string | null;
  language: string | undefined;
  genreNames: string[];
  id: number;
  name: string;
  network: string | undefined;
  overview: string;
  posterPath: string | null;
  seasonsWithEpisodes: SeasonWithEpisodes[];
  status: ShowStatus;
  videoTrailerKey: string | undefined;
  voteAverage: string;
  voteCount: number;
  yearsActive: string;
};

export type PopularShow = {
  id: number;
  fetchedAt: string;
  name: string;
  posterPath: string | null | undefined;
};

export type CalendarEpisode = {
  color: string;
  date: string;
  episodeId: number;
  episodeName: string;
  episodeNumber: number;
  isMulipleEvent?: boolean;
  multipleEventSpanAmount?: number;
  network: string;
  overview: string;
  runtime: number;
  seasonAndEpisodeNumbersFull?: string;
  seasonNumber: number;
  showId: number;
  showName: string;
  title: string;
};

export type SavedQuery = {
  query: string;
  results: TmdbShowSummary[];
  timeSaved: string;
  totalResults: number;
};

export type TmdbShowWithSeasons = TmdbShow & {
  seasonsWithEpisodes?: Record<number, TmdbSeason>;
};
