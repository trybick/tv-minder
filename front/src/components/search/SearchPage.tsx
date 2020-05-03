import React, { ChangeEvent } from 'react';
import { Box } from '@chakra-ui/core';
import { searchShows } from 'gateway/searchShows';
import SearchResultsContainer from './subcomponents/SearchResultsContainer';
import SearchInput from './subcomponents/SearchInput';

const SearchPage = (): JSX.Element => {
  const [inputValue, setInputValue] = React.useState('');
  const [isInputDirty, setIsInputDirty] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [shows, setShows] = React.useState<any[]>([]);
  const [totalResults, setTotalResults] = React.useState<number>(0);

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

    const { results, totalResults } = await searchShows(query);
    if (!results) return;

    setShows(results);
    setTotalResults(totalResults);
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

export default SearchPage;
