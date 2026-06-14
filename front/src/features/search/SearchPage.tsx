import { Box, Flex } from '@chakra-ui/react';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';

import { WelcomeHeroStrip } from '~/features/discover/WelcomeHeroStrip';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  selectShouldResetSearchInput,
  setShouldResetSearchInput,
} from '~/store/rtk/slices/searchInput.slice';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';
import { getShowDetailsForSearchResults } from '~/store/tv/actions';
import { searchShowsByQuery } from '~/store/tv/services/searchShowsByQuery';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { type DiscoverFilters } from '~/store/tv/types/transformed';
import { tmdbApi } from '~/store/tv/utils/tmdbApi';
import { trackEvent } from '~/utils/analytics';
import { useDebouncedFunction } from '~/utils/debounce';
import { handleKyError } from '~/utils/handleKyError';
import { applyViewTransition } from '~/utils/viewTransition';

import { SearchContainer } from './SearchContainer';
import { SearchFilters } from './SearchFilters';
import { SearchInput } from './SearchInput';
import { countActiveFilters } from './helpers';

export const SearchPage = () => {
  const dispatch = useAppDispatch();
  const shouldResetSearchInput = useAppSelector(selectShouldResetSearchInput);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TmdbShowSummary[]>([]);
  const [activeFilters, setActiveFilters] = useState<DiscoverFilters | null>(
    null
  );

  const activeFilterCount = activeFilters
    ? countActiveFilters(activeFilters)
    : 0;

  const showWelcomeHero =
    !isLoggedIn && !isInputDirty && activeFilterCount === 0;

  const executeQuery = async (
    query: string,
    filters: DiscoverFilters | null
  ) => {
    const trimmed = query.trim();
    const hasFilters = !!filters && countActiveFilters(filters) > 0;

    if (!trimmed && !hasFilters) {
      applyViewTransition(() => setResults([]));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      if (trimmed) {
        trackEvent({
          category: 'Search',
          action: 'Performed Search',
          label: trimmed,
        });
        const { results: searchResults } = await searchShowsByQuery(trimmed);
        const found = searchResults ?? [];
        setResults(found);
        dispatch(getShowDetailsForSearchResults(found.map(s => s.id)));
      } else {
        const data = await tmdbApi.discoverWithFilters(filters!);
        setResults(data.results);
        dispatch(getShowDetailsForSearchResults(data.results.map(s => s.id)));
      }
    } catch (error) {
      handleKyError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedExecute = useDebouncedFunction(executeQuery);

  const handleClearInput = () => {
    setInputValue('');
    setIsInputDirty(false);
    executeQuery('', activeFilters);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (shouldResetSearchInput) {
      queueMicrotask(() => {
        setInputValue('');
        setIsInputDirty(false);
        setActiveFilters(null);
        applyViewTransition(() => setResults([]));
        dispatch(setShouldResetSearchInput(false));
      });
    }
  }, [shouldResetSearchInput, dispatch]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;
    setInputValue(searchValue);

    if (searchValue?.length) {
      setIsLoading(true);
      setIsInputDirty(true);
      debouncedExecute(searchValue, null);
    } else {
      setIsInputDirty(false);
      executeQuery('', activeFilters);
    }
  };

  const handleApplyFilters = (filters: DiscoverFilters) => {
    setActiveFilters(filters);
    executeQuery('', filters);
  };

  const handleClearFilters = () => {
    setActiveFilters(null);
    executeQuery(inputValue, null);
  };

  return (
    <Box pt={{ base: 0, md: 5 }} pb="8">
      <title>Discover | TV Minder</title>

      {showWelcomeHero && <WelcomeHeroStrip />}
      <SearchInput
        handleChange={handleChange}
        handleClearInput={handleClearInput}
        inputRef={inputRef}
        inputValue={inputValue}
      />
      <Flex justify="center" mb={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
        <SearchFilters
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          activeFilterCount={activeFilterCount}
          disabled={!!inputValue}
        />
      </Flex>
      <SearchContainer
        isInputDirty={isInputDirty}
        isLoading={isLoading}
        results={results}
        isFilterActive={activeFilterCount > 0}
      />
    </Box>
  );
};
