import { type ShowStatus } from '~/store/tv/utils/formatting';

import {
  type TmdbSeason,
  type TmdbShow,
  type TmdbShowReviews,
  type TmdbShowVideos,
  type TmdbShowWatchProviders,
} from './tmdbSchema';

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
  lastEpisodeAirDate: string | null;
  name: string;
  network: string | undefined;
  nextEpisodeAirDate: string | null;
  overview: string;
  posterPath: string | null;
  seasonsWithEpisodes: SeasonWithEpisodes[];
  status: ShowStatus;
  videos: ShowVideo[];
  reviews: ShowReview[];
  watchProviders: ShowWatchProviders | null;
  videoTrailerKey: string | undefined;
  voteAverage: string;
  voteCount: number;
  startYear: string;
};

export type ShowVideo = {
  key: string;
  name: string;
  type: string;
};

export type ShowReview = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  url: string;
};

export type ShowWatchProvider = {
  id: number;
  name: string;
  logoPath: string | null;
};

export type ShowWatchProviders = {
  region: string;
  link: string;
  flatrate: ShowWatchProvider[];
  rent: ShowWatchProvider[];
  buy: ShowWatchProvider[];
};

export type DiscoverShow = {
  id: number;
  firstAirDate: string | null;
  name: string;
  overview: string;
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

export type TmdbShowWithSeasons = TmdbShow & {
  seasonsWithEpisodes?: Record<number, TmdbSeason>;
  showVideos?: TmdbShowVideos;
  showReviews?: TmdbShowReviews;
  showWatchProviders?: TmdbShowWatchProviders;
  watchRegion?: string;
};
