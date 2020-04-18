import React from 'react';
import { Box, Grid, Input } from '@chakra-ui/core';
import { makeRequest } from '../utils/searchUtils';
import { baseUrl } from '../utils/constants';

const SearchField = (): JSX.Element => {
  const [shows, setShows] = React.useState<any[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;

    setInputValue(searchValue);
    handleSearch(searchValue);
  };

  const handleSearch = async (val: string) => {
    setIsLoading(true);

    const requestConfig = {
      api_key: process.env.REACT_APP_API_KEY,
      query: val,
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

      {shows?.length ? (
        <Box>
          {shows.map((show) => (
            <Box key={show.id}>{show.name}</Box>
          ))}
        </Box>
      ) : (
        <Box>There are no shows</Box>
      )}
    </Grid>
  );
};

export default SearchField;
