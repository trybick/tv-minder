import { Box } from '@chakra-ui/react';
import moment from 'moment';
import { ChangeEvent, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import SearchContainer from '~/components/search/SearchContainer';
import SearchInput from '~/components/search/subcomponents/SearchInput';
import { searchShowsByQuery } from '~/gateway/searchShowsByQuery';
import { useAppDispatch } from '~/store';
import { saveSearchQueryAction } from '~/store/tv/actions';
import { selectSavedQueries } from '~/store/tv/selectors';
import { SavedQuery } from '~/store/tv/types';
import { ShowSearchResult } from '~/types/external';
import cacheDurationDays from '~/utils/cacheDurations';
import { useDebouncedFunction } from '~/utils/debounce';

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const savedQueries = useSelector(selectSavedQueries);

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shows, setShows] = useState<ShowSearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;
    setInputValue(searchValue);

    if (searchValue?.length > 2) {
      setIsLoading(true);
      setIsInputDirty(true);
      handleSearch(searchValue);
    } else {
      setIsLoading(false);
      setIsInputDirty(false);
      setShows([]);
    }
  };

  const handleClearInput = () => {
    setIsInputDirty(false);
    setInputValue('');
    setShows([]);
    inputRef.current?.focus();
  };

  const handleSearch = useDebouncedFunction(async (query: string) => {
    const { results, totalResults } = await getQueryData(query);
    if (!results) return;

    setShows(results);
    setTotalResults(totalResults);
    setIsLoading(false);
  });

  // Save network calls to cache with a timestamp
  const getQueryData = async (query: string): Promise<SavedQuery> => {
    let queryData: SavedQuery;
    const index = savedQueries.findIndex(data => data.query === query);
    const isCached = index > -1;

    if (isCached && getIsCacheValid(index)) {
      queryData = savedQueries[index];
    } else {
      const { results, totalResults } = await searchShowsByQuery(query);
      queryData = { query, results, timeSaved: moment(), totalResults };
      dispatch(saveSearchQueryAction(queryData));
    }

    return queryData;
  };

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
