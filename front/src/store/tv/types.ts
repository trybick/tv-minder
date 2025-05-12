import { ShowSearchResult } from '~/types/external';

export type SavedQuery = {
  query: string;
  results: ShowSearchResult[];
  timeSaved: string;
  totalResults: number;
};
