import { Flex } from '@chakra-ui/react';

import LoadingSpinner from '~/components/LoadingSpinner';
import { ShowSearchResult } from '~/types/external';

import { NoResultsFound } from './NoResultsFound';
import PopularShows from './PopularShows';
import SearchResults from './SearchResults';

type Props = {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: ShowSearchResult[];
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
      <LoadingSpinner />
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
