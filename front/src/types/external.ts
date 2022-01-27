import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { StatusWithColor } from 'store/tv/tvUtils';

// Data returned from 'The Movie DB' API
//
// Search
//
export type ShowSearchResult = {
  backdrop_path: string;
  first_air_date: '1965-09-14';
  genre_ids: number[];
  id: number;
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
type Episode = {
  airDate: string;
  daysDiff: string;
  episodeNumber: string;
  name: string;
  overview: string;
  seasonNumber: string;
  timeFromNow: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type BasicShowInfo = {
  backdropPath: string;
  createdBy: string | undefined;
  episodeRunTime: number;
  firstAirDate: string;
  language: string;
  genreNames: string[];
  id: number;
  inProduction: boolean;
  lastAirDate: string;
  lastEpisodeForDisplay: Episode;
  name: string;
  network: string;
  nextEpisodeForDisplay: Episode;
  numEpisodes: number;
  numSeasons: number;
  overview: string;
  posterPath: string;
  statusWithColor: StatusWithColor;
  tagline: string;
  videoTrailerKey: string;
  voteAverage: number;
  voteCount: number;
};

//
// Misc types
//
export type GoogleLoginResponses = GoogleLoginResponse | GoogleLoginResponseOffline;

export type PopularShow = {
  id: number;
  backdropPath: string;
  fetchedAt: string;
  name: string;
  overview: string;
  popularity: number;
  posterPath: string;
  voteAverage: string;
  voteCount: number;
};
