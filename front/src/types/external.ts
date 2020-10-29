import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

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
  episodeNumber: number;
  name: string;
  overview: string;
  seasonNumber: number;
};

type Network = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};

export type Status = 'Ended' | 'Returning' | 'New Episodes';

export type BasicShowInfo = {
  id: number;
  lastAirDate: string;
  lastEpisodeForDisplay: Episode;
  name: string;
  network: Network;
  nextEpisodeForDisplay: Episode;
  numEpisodes: number;
  numSeasons: number;
  posterPath: string;
  status: Status;
};

// Google 0Auth
export type GoogleLoginResponses = GoogleLoginResponse | GoogleLoginResponseOffline;
