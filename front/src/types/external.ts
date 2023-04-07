import { StatusWithColor } from 'store/tv/tvUtils';
import { ID } from 'types/common';

//
// Search
//
export type ShowSearchResult = {
  backdrop_path: string;
  first_air_date: '1965-09-14';
  genre_ids: ID[];
  id: ID;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
};

//
// Basic Show Info
//
export type EpisodeForDisplay = {
  airDate: string;
  daysDiff: string;
  episodeNumber: string;
  name: string;
  overview: string;
  seasonNumber: string;
  timeFromNow: string;
};

export type Genre = {
  id: ID;
  name: string;
};

export type EpisodeForSeason = {
  airDate: string;
  episodeNumber: number;
  id: ID;
  name: string;
  overview: string;
  seasonNumber: number;
  stillPath: string;
  voteAverage: string;
  voteCount: number;
};

export type SeasonWithEpisodes = {
  airDate: string;
  episodes: EpisodeForSeason[];
  id: ID;
  isSpecialsSeason: boolean;
  name: string;
  nameForDisplay: string;
  overview: string;
  posterPath: string;
  seasonNumber: number;
};

export type BasicShowInfo = {
  backdropPath: string;
  createdBy: string | undefined;
  episodeRunTime: number | undefined;
  firstAirDate: string;
  language: string | undefined;
  genreNames: string[];
  id: ID;
  inProduction: boolean;
  lastAirDate: string;
  lastEpisodeForDisplay: EpisodeForDisplay;
  name: string;
  network: string;
  nextEpisodeForDisplay: EpisodeForDisplay;
  numEpisodes: number;
  numSeasons: number;
  overview: string;
  posterPath: string;
  seasonsWithEpisodes: SeasonWithEpisodes[];
  statusWithColor: StatusWithColor;
  tagline: string;
  videoTrailerKey: string | undefined;
  voteAverage: number;
  voteCount: number;
  yearsActive: string;
};

//
// Popular Show
//
export type PopularShow = {
  id: ID;
  fetchedAt: string;
  name: string;
  posterPath: string;
};

// Calendar
export type CalendarEpisode = {
  color: string;
  date: string;
  episodeId: number;
  episodeName: string;
  episodeNumber: number;
  extendedProps: { showId: number };
  network: string;
  overview: string;
  runtime: number;
  seasonAndEpisodeNumbers: string;
  seasonNumber: number;
  showName: string;
  title: string;
};
