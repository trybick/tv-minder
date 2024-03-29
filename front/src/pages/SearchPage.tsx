import { ChangeEvent, useRef, useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import moment from 'moment';
import { Helmet } from 'react-helmet-async';
import { searchShowsByQuery } from 'gateway/searchShowsByQuery';
import { AppState, AppThunkDispatch } from 'store';
import { saveSearchQueryAction } from 'store/tv/actions';
import { selectSavedQueries } from 'store/tv/selectors';
import { SavedQuery } from 'store/tv/types';
import { ShowSearchResult } from 'types/external';
import cacheDurationDays from 'utils/cacheDurations';
import SearchContainer from 'components/search/SearchContainer';
import SearchInput from 'components/search/subcomponents/SearchInput';
import { useDebouncedFunction } from 'utils/debounce';
import { Box } from '@chakra-ui/react';

type StateProps = {
  savedQueries: SavedQuery[];
};

type DispatchProps = {
  saveSearchQuery: (query: SavedQuery) => void;
};

type Props = StateProps & DispatchProps;

const SearchPage = ({ saveSearchQuery, savedQueries }: Props) => {
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
      saveSearchQuery(queryData);
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
      <Helmet title="Search | TV Minder" />
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

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (
  state: AppState
): StateProps => ({
  savedQueries: selectSavedQueries(state),
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  saveSearchQuery: (query: SavedQuery) => dispatch(saveSearchQueryAction(query)),
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SearchPage);
