import { Flex } from '@chakra-ui/react';

import { TmdbShowSummary } from '~/store/tv/types/tmdbSchema';

import { NoResultsFound } from './NoResultsFound';
import PopularShows from './PopularShows';
import SearchResults from './SearchResults';
import SearchResultsSkeleton from './SearchResultsSkeleton';

type Props = {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: TmdbShowSummary[];
  totalResults: number;
};

const SearchContainer = ({
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
      <PopularShows />
    )}
  </Flex>
);

export default SearchContainer;
