import React, { ChangeEvent, useRef, useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import moment from 'moment';
import { Box, useColorMode } from '@chakra-ui/core';
import { searchShows } from 'gateway/searchShows';
import { AppState, AppThunkDispatch } from 'store';
import { saveSearchQueryAction } from 'store/tv/actions';
import { selectSavedQueries } from 'store/tv/selectors';
import { SavedQuery } from 'store/tv/types';
import { ShowSearchResult } from 'types/external';
import cacheDurationDays from 'utils/cacheDurations';
import SearchContainer from '../components/search/SearchContainer';
import SearchInput from '../components/search/subcomponents/SearchInput';

interface StateProps {
  savedQueries: SavedQuery[];
}

interface DispatchProps {
  saveSearchQuery: (query: SavedQuery) => void;
}

type Props = StateProps & DispatchProps;

const SearchPage = ({ saveSearchQuery, savedQueries }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shows, setShows] = useState<ShowSearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const { colorMode } = useColorMode();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;
    setIsInputDirty(true);
    setInputValue(searchValue);

    if (searchValue) {
      handleSearch(searchValue);
    } else {
      setShows([]);
      setIsInputDirty(false);
    }
  };

  const handleClearInput = () => {
    setIsInputDirty(false);
    setInputValue('');
    setShows([]);
    inputRef.current?.focus();
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);

    const { results, totalResults } = await getQueryData(query);
    if (!results) return;

    setShows(results);
    setTotalResults(totalResults);
    setIsLoading(false);
  };

  // Save network calls to cache with a timestamp
  const getQueryData = async (query: string): Promise<SavedQuery> => {
    let queryData: SavedQuery;
    const index = savedQueries.findIndex(data => data.query === query);
    const isCached = index > -1;

    if (isCached && getIsCacheValid(index)) {
      queryData = savedQueries[index];
    } else {
      const { results, totalResults } = await searchShows(query);
      queryData = { query, results, timeSaved: moment(), totalResults };
      saveSearchQuery(queryData);
    }

    return queryData;
  };

  // Check if timestamp is within set duration
  const getIsCacheValid = (index: number) => {
    const { timeSaved } = savedQueries[index];
    const diff = moment().diff(moment(timeSaved), 'days');

    return cacheDurationDays.search > diff;
  };

  return (
    <Box
      background={colorMode === 'light' ? '#FAFAFA' : '#252E41'}
      borderRadius="15px"
      flex="1"
      margin="50px"
      mb="25px"
      pb="20px"
    >
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
