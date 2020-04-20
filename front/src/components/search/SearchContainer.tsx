import React, { ChangeEvent } from 'react';
import { Box } from '@chakra-ui/core';
import { makeRequest } from '../../utils/searchUtils';
import { baseUrl } from '../../utils/constants';
import SearchResultsContainer from './SearchResultsContainer';
import SearchInput from './SearchInput';

const SearchContainer = (): JSX.Element => {
  const [inputValue, setInputValue] = React.useState('');
  const [isInputDirty, setIsInputDirty] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [shows, setShows] = React.useState<any[]>([]);

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

    const requestConfig = {
      api_key: process.env.REACT_APP_API_KEY,
      query,
    };
    const fetchedShows = await makeRequest(baseUrl, requestConfig);

    setShows(fetchedShows);
    setIsLoading(false);
  };

  return (
    <Box>
      <SearchInput handleChange={handleChange} inputValue={inputValue} />
      <SearchResultsContainer isInputDirty={isInputDirty} isLoading={isLoading} shows={shows} />
    </Box>
  );
};

export default SearchContainer;
