import React from 'react';
import axios from 'axios';
import { Box, Grid, Input } from '@chakra-ui/core';

const resources: any = {};

const searchCreator = async (query: string) => {
  let token: any;
  let results: any;
  results = await search(query);

  async function search(query: string) {
    if (token) {
      token.cancel();
    }

    token = axios.CancelToken.source();
    try {
      if (resources[query]) {
        return resources[query];
      }

      const res = await axios(query, { cancelToken: token.token });
      results = res.data.results;
      resources[query] = results;

      return results;
    } catch (error) {
      console.log('Something went wrong: ', error.message);
    }
  }

  return results;
};

const SearchField = (): JSX.Element => {
  const [value, setValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;

    setValue(searchValue);
    search(searchValue);
  };

  const [shows, setShows] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const search = async (val: string) => {
    setIsLoading(true);

    const apiUrl = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${val}`;
    const res = await searchCreator(apiUrl);
    const fetchedShows = await res;

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
