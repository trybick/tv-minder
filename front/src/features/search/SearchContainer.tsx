import { Flex } from '@chakra-ui/react';

import { DiscoverShows } from '~/features/discover/DiscoverShows';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';

import { NoResultsFound } from './NoResultsFound';
import { SearchResults } from './SearchResults';
import { SearchResultsSkeleton } from './SearchResultsSkeleton';

type Props = {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: TmdbShowSummary[];
  totalResults: number;
};

export const SearchContainer = ({
  isInputDirty,
  isLoading,
  shows,
  totalResults,
}: Props) => (
  <Flex justify="center" justifyContent="center" m="0 auto">
    {isLoading ? (
      <SearchResultsSkeleton />
    ) : shows?.length ? (
      <SearchResults shows={shows} totalResults={totalResults} />
    ) : isInputDirty ? (
      <NoResultsFound />
    ) : (
      <DiscoverShows />
    )}
  </Flex>
);
