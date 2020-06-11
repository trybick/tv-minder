import React, { ChangeEvent, useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Box } from '@chakra-ui/core';
import { searchShows } from 'gateway/searchShows';
import { ShowSearchResult } from 'types/external';
import { AppState, AppThunkDispatch } from 'store';
import { saveSearchQueryAction } from 'store/tv/actions';
import { selectSavedQueries } from 'store/tv/reducers';
import SearchResultsContainer from './subcomponents/SearchResultsContainer';
import SearchInput from './subcomponents/SearchInput';

export type SavedQuery = {
  query: string;
  results: ShowSearchResult[];
  totalResults: number;
};

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
    const index = savedQueries.findIndex(data => data.query === query);
    const isCached = index > -1;

    if (isCached) {
      const { results, totalResults } = savedQueries[index];
      setShows(results);
      setTotalResults(totalResults);
    } else {
      const { results, totalResults } = await searchShows(query);
      if (!results) return;
      const queryToSave = { query, results, totalResults };
      saveSearchQuery(queryToSave);
      setShows(results);
      setTotalResults(totalResults);
    }

    setIsLoading(false);
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
