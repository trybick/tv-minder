import React from 'react';
import { Grid, Input } from '@chakra-ui/core';
import { makeRequest } from '../utils/searchUtils';
import { baseUrl } from '../utils/constants';
import SearchResults from './SearchResults';

const SearchContainer = (): JSX.Element => {
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [shows, setShows] = React.useState<any[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;
    setInputValue(searchValue);

    searchValue ? handleSearch(searchValue) : setShows([]);
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
    <Grid w="sm" m="100px auto">
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter show name"
        variant="flushed"
        focusBorderColor="teal.500"
      />
      <SearchResults isLoading={isLoading} shows={shows} />
    </Grid>
  );
};

export default SearchContainer;
