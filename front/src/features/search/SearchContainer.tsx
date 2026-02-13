import { Flex } from '@chakra-ui/react';

import { DiscoverShows } from '~/features/discover/DiscoverShows';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';

import { FilteredResults } from './FilteredResults';
import { NoResultsFound } from './NoResultsFound';
import { SearchResults } from './SearchResults';
import { SearchResultsSkeleton } from './SearchResultsSkeleton';

type Props = {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: TmdbShowSummary[];
  totalResults: number;
  filteredShows: TmdbShowSummary[];
  filteredTotalResults: number;
  isFilterActive: boolean;
  isFilterLoading: boolean;
};

export const SearchContainer = ({
  isInputDirty,
  isLoading,
  shows,
  totalResults,
  filteredShows,
  filteredTotalResults,
  isFilterActive,
  isFilterLoading,
}: Props) => {
  // When there's a search query (isInputDirty), results are in `shows`
  // When there's only filters (no search), results are in `filteredShows`
  const hasSearchResults = isInputDirty && shows?.length;
  const hasFilteredResults =
    !isInputDirty && isFilterActive && filteredShows?.length;

  return (
    <Flex justify="center" justifyContent="center" m="0 auto">
      {isLoading || isFilterLoading ? (
        <SearchResultsSkeleton />
      ) : hasSearchResults ? (
        <SearchResults shows={shows} totalResults={totalResults} />
      ) : hasFilteredResults ? (
        <FilteredResults
          shows={filteredShows}
          totalResults={filteredTotalResults}
        />
      ) : isInputDirty || isFilterActive ? (
        <NoResultsFound />
      ) : (
        <DiscoverShows />
      )}
    </Flex>
  );
};
