import { Moment } from 'moment';
import { ShowSearchResult } from 'types/external';

export type SavedQuery = {
  query: string;
  results: ShowSearchResult[];
  timeSaved: Moment;
  totalResults: number;
};
