import { StatusWithColor } from '~/store/legacy/tv/utils/formatting';

import { TmdbShowSummary } from './tmdbSchema';

export type EpisodeForDisplay = {
  airDate: string;
  episodeNumber: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type EpisodeForSeason = {
  airDate: string;
  episodeNumber: number;
  name: string;
  voteAverage: string;
};

export type SeasonWithEpisodes = {
  airDate: string;
  episodes: EpisodeForSeason[];
  id: number;
  isSpecialsSeason: boolean;
  name: string;
  nameForDisplay: string;
  overview: string;
  posterPath: string;
  seasonNumber: number;
};

export type ShowForDisplay = {
  backdropPath: string;
  episodeRunTime: number | undefined;
  firstAirDate: string;
  language: string | undefined;
  genreNames: string[];
  id: number;
  name: string;
  network: string;
  overview: string;
  posterPath: string;
  seasonsWithEpisodes: SeasonWithEpisodes[];
  statusWithColor: StatusWithColor;
  videoTrailerKey: string | undefined;
  voteAverage: number;
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
