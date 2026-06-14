import { PageContainer } from '~/components/PageContainer';
import { DiscoverShows } from '~/features/discover/DiscoverShows';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';

import { NoResultsFound } from './NoResultsFound';
import { SearchResults } from './SearchResults';
import { SearchResultsSkeleton } from './SearchResultsSkeleton';

type Props = {
  isInputDirty: boolean;
  isLoading: boolean;
  results: TmdbShowSummary[];
  isFilterActive: boolean;
};

export const SearchContainer = ({
  isInputDirty,
  isLoading,
  results,
  isFilterActive,
}: Props) => {
  return (
    <PageContainer>
      {isLoading ? (
        <SearchResultsSkeleton />
      ) : results?.length ? (
        <SearchResults shows={results} />
      ) : isInputDirty || isFilterActive ? (
        <NoResultsFound />
      ) : (
        <DiscoverShows />
      )}
    </PageContainer>
  );
};
