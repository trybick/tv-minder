import React from 'react';
import axios, { CancelTokenSource } from 'axios';
import { Box, Grid, Input } from '@chakra-ui/core';

const baseUrl = 'https://api.themoviedb.org/3/search/tv';
const cachedResults: any = {};

const makeRequestCreator = () => {
  let cancelToken: CancelTokenSource;

  return (url: string, requestConfig: any) => {
    if (cancelToken) {
      cancelToken.cancel();
    }
    cancelToken = axios.CancelToken.source();

    return cachedResults[requestConfig.query]
      ? cachedResults[requestConfig.query]
      : axios
          .get(url, {
            cancelToken: cancelToken.token,
            params: requestConfig,
          })
          .then((res) => {
            cachedResults[requestConfig.query] = res.data.results;

            return res.data.results;
          })
          .catch((err: Error) => {
            console.log('Axios error:', err.message);
          });
  };
};

const makeRequest = makeRequestCreator();

const SearchField = (): JSX.Element => {
  const [value, setValue] = React.useState('');
  const [shows, setShows] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;
    setValue(searchValue);
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
        value={value}
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
