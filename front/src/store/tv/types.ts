import { ShowSearchResult } from 'types/external';

export type SavedQuery = {
  query: string;
  results: ShowSearchResult[];
  totalResults: number;
};
