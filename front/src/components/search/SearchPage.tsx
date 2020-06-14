import React, { ChangeEvent, useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import moment from 'moment';
import { Box } from '@chakra-ui/core';
import { searchShows } from 'gateway/searchShows';
import { ShowSearchResult } from 'types/external';
import { AppState, AppThunkDispatch } from 'store';
import { saveSearchQueryAction } from 'store/tv/actions';
import { selectSavedQueries } from 'store/tv/reducers';
import { SavedQuery } from 'store/tv/types';
import SearchResultsContainer from './subcomponents/SearchResultsContainer';
import SearchInput from './subcomponents/SearchInput';

interface StateProps {
  savedQueries: SavedQuery[];
}

interface DispatchProps {
  saveSearchQuery: (query: SavedQuery) => void;
}

type Props = StateProps & DispatchProps;

const SearchPage = ({ saveSearchQuery, savedQueries }: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState('');
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shows, setShows] = useState<ShowSearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);

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
    const CACHE_DURATION = 3;
    const { timeSaved } = savedQueries[index];
    const diff = moment().diff(moment(timeSaved), 'days');

    return CACHE_DURATION > diff ? true : false;
  };

  return (
    <Box>
      <SearchInput handleChange={handleChange} inputValue={inputValue} />
      <SearchResultsContainer
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
