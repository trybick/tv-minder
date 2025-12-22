import { Box } from '@chakra-ui/react';
import moment from 'moment';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '~/store';
import { saveSearchQueryAction } from '~/store/legacy/tv/actions';
import { SavedQuery } from '~/store/legacy/tv/reducers';
import { selectSavedQueries } from '~/store/legacy/tv/selectors';
import { searchShowsByQuery } from '~/store/legacy/tv/services/searchShowsByQuery';
import {
  selectShouldResetSearchInput,
  setShouldResetSearchInput,
} from '~/store/rtk/slices/searchInput.slice';
import { ShowSearchResult } from '~/types/external';
import { applyViewTransition } from '~/utils/applyViewTransition';
import cacheDurationDays from '~/utils/cacheDurations';
import { useDebouncedFunction } from '~/utils/debounce';

import SearchContainer from './SearchContainer';
import SearchInput from './SearchInput';

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const savedQueries = useAppSelector(selectSavedQueries);
  const shouldResetSearchInput = useAppSelector(selectShouldResetSearchInput);

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shows, setShows] = useState<ShowSearchResult[]>([]);
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

  // Save network calls to cache with a timestamp
  const getQueryData = async (query: string): Promise<SavedQuery> => {
    let queryData: SavedQuery;
    const index = savedQueries.findIndex(data => data.query === query);
    const isCached = index > -1;

    if (isCached && getIsCacheValid(index)) {
      queryData = savedQueries[index];
    } else {
      const { results, totalResults } = await searchShowsByQuery(query);
      queryData = {
        query,
        results,
        timeSaved: moment().toISOString(),
        totalResults,
      };
      dispatch(saveSearchQueryAction(queryData));
    }

    return queryData;
  };

  const handleSearch = useDebouncedFunction(async (query: string) => {
    const { results, totalResults } = await getQueryData(query);
    if (!results) return;

    setShows(results);
    setTotalResults(totalResults);
    setIsLoading(false);
  });

  const getIsCacheValid = (index: number) => {
    const { timeSaved } = savedQueries[index];
    const diff = moment().diff(moment(timeSaved), 'days');
    return cacheDurationDays.search > diff;
  };

  return (
    <Box p={{ base: '0 10px 25px', md: '25px 15px 20px' }}>
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

export default SearchPage;
