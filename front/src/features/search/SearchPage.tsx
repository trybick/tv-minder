import { Box } from '@chakra-ui/react';
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useAppDispatch, useAppSelector } from '~/store';
import {
  selectShouldResetSearchInput,
  setShouldResetSearchInput,
} from '~/store/rtk/slices/searchInput.slice';
import { getShowDetailsForSearchResults } from '~/store/tv/actions';
import { searchShowsByQuery } from '~/store/tv/services/searchShowsByQuery';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { type DiscoverFilters } from '~/store/tv/types/transformed';
import { tmdbApi } from '~/store/tv/utils/tmdbApi';
import { useDebouncedFunction } from '~/utils/debounce';
import { handleKyError } from '~/utils/handleKyError';
import { applyViewTransition } from '~/utils/viewTransition';

import { SearchContainer } from './SearchContainer';
import { SearchFilters } from './SearchFilters';
import { SearchInput } from './SearchInput';
import { applyFiltersToResults, countActiveFilters } from './helpers';

export const SearchPage = () => {
  const dispatch = useAppDispatch();
  const shouldResetSearchInput = useAppSelector(selectShouldResetSearchInput);

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shows, setShows] = useState<TmdbShowSummary[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  const [activeFilters, setActiveFilters] = useState<DiscoverFilters | null>(
    null
  );
  const [filteredShows, setFilteredShows] = useState<TmdbShowSummary[]>([]);
  const [filteredTotalResults, setFilteredTotalResults] = useState(0);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const activeFilterCount = activeFilters
    ? countActiveFilters(activeFilters)
    : 0;

  const handleClearInput = useCallback(() => {
    setInputValue('');
    setIsInputDirty(false);
    applyViewTransition(() => setShows([]));
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (shouldResetSearchInput) {
      queueMicrotask(() => {
        handleClearInput();
        setActiveFilters(null);
        setFilteredShows([]);
        setFilteredTotalResults(0);
        dispatch(setShouldResetSearchInput(false));
      });
    }
  }, [shouldResetSearchInput, dispatch, handleClearInput]);

  // ── Text search ──────────────────────────────────────────────
  const handleSearch = useDebouncedFunction(async (query: string) => {
    const { results } = await searchShowsByQuery(query);
    if (!results) {
      return;
    }

    setShows(results);
    setTotalResults(results.length);
    setIsLoading(false);
    dispatch(getShowDetailsForSearchResults(results.map(s => s.id)));
  });

  // ── Input change handler ────────────────────────────────────
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;
    setInputValue(searchValue);

    if (searchValue?.length) {
      setIsLoading(true);
      setIsInputDirty(true);
      handleSearch(searchValue);
    } else {
      setIsLoading(false);
      setIsInputDirty(false);
      applyViewTransition(() => setShows([]));
    }
  };

  // ── Filter apply / clear ────────────────────────────────────
  const handleApplyFilters = useCallback(
    async (filters: DiscoverFilters) => {
      setActiveFilters(filters);

      if (inputValue) {
        // Text + filters must use /search/tv + client-side filters.
        // TMDB /discover/tv ignores `query`.
        setIsLoading(true);
        try {
          const { results } = await searchShowsByQuery(inputValue);
          const finalResults = applyFiltersToResults(results, filters);
          setShows(finalResults);
          setTotalResults(finalResults.length);
          dispatch(getShowDetailsForSearchResults(finalResults.map(s => s.id)));
        } catch (error) {
          handleKyError(error);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // No text → pure discover with filters
      setIsFilterLoading(true);
      try {
        const data = await tmdbApi.discoverWithFilters(filters);
        setFilteredShows(data.results);
        setFilteredTotalResults(data.total_results);
        dispatch(getShowDetailsForSearchResults(data.results.map(s => s.id)));
      } catch (error) {
        handleKyError(error);
      } finally {
        setIsFilterLoading(false);
      }
    },
    [dispatch, inputValue]
  );

  const handleClearFilters = useCallback(() => {
    setActiveFilters(null);
    setFilteredShows([]);
    setFilteredTotalResults(0);

    // Re-run search without filters if there's text
    if (inputValue) {
      setIsLoading(true);
      handleSearch(inputValue);
    }
  }, [inputValue, handleSearch]);

  return (
    <Box p={{ base: '0 12px 30px', md: '20px 20px 30px' }}>
      <title>Discover | TV Minder</title>
      <SearchInput
        handleChange={handleChange}
        handleClearInput={handleClearInput}
        inputRef={inputRef}
        inputValue={inputValue}
        filterSlot={
          <SearchFilters
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            activeFilterCount={activeFilterCount}
          />
        }
      />
      <SearchContainer
        isInputDirty={isInputDirty}
        isLoading={isLoading}
        shows={shows}
        totalResults={totalResults}
        filteredShows={filteredShows}
        filteredTotalResults={filteredTotalResults}
        isFilterActive={activeFilterCount > 0}
        isFilterLoading={isFilterLoading}
      />
    </Box>
  );
};
