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
import { useDebouncedFunction } from '~/utils/debounce';
import { applyViewTransition } from '~/utils/viewTransition';

import { SearchContainer } from './SearchContainer';
import { SearchInput } from './SearchInput';

export const SearchPage = () => {
  const dispatch = useAppDispatch();
  const shouldResetSearchInput = useAppSelector(selectShouldResetSearchInput);

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shows, setShows] = useState<TmdbShowSummary[]>([]);
  const [totalResults, setTotalResults] = useState(0);

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
        dispatch(setShouldResetSearchInput(false));
      });
    }
  }, [shouldResetSearchInput, dispatch, handleClearInput]);

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

  const handleSearch = useDebouncedFunction(async (query: string) => {
    const { results, totalResults } = await searchShowsByQuery(query);
    if (!results) {
      return;
    }

    setShows(results);
    setTotalResults(totalResults);
    setIsLoading(false);
    dispatch(getShowDetailsForSearchResults(results.map(show => show.id)));
  });

  return (
    <Box p={{ base: '0 12px 30px', md: '20px 20px 30px' }}>
      <title>Discover | TV Minder</title>
      <SearchInput
        handleChange={handleChange}
        handleClearInput={handleClearInput}
        inputRef={inputRef}
        inputValue={inputValue}
      />
      <SearchContainer
        isInputDirty={isInputDirty}
        isLoading={isLoading}
        shows={shows}
        totalResults={totalResults}
      />
    </Box>
  );
};
