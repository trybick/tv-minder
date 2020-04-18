import React from 'react';
import axios from 'axios';
import { Box, Grid, Input } from '@chakra-ui/core';

// SearchField will be broken up into smaller components once the basics are set up
const SearchField = (): JSX.Element => {
  // Input handlers
  const [value, setValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const searchValue = event.target.value;

    setValue(searchValue);
    search(searchValue);
  };

  // Instant search
  const [shows, setShows] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const search = async (val: string) => {
    setIsLoading(true);
    const res = await axios(
      `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${val}`
    );
    const fetchedShows = await res.data.results;

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

      {/* Instant Search */}
      {shows ? (
        <Box>
          {shows.map((show) => (
            <Box>{show.name}</Box>
          ))}
        </Box>
      ) : (
        <Box>There are no shows</Box>
      )}
    </Grid>
  );
};

export default SearchField;
