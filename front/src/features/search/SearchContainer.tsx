import { Flex, Text } from '@chakra-ui/react';

import LoadingSpinner from '~/components/LoadingSpinner';
import { ShowSearchResult } from '~/types/external';

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
      <Text mt="24px">There are no shows to display.</Text>
    ) : (
      <PopularShows />
    )}
  </Flex>
);

export default SearchContainer;
