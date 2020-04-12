import React from 'react';
import { Grid, IconButton, Input } from '@chakra-ui/core';

const SearchField = (): JSX.Element => {
  const [value, setValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setValue(event.target.value);

  const handleSubmit = (): void => {
    console.log('Current text is:', value);
  };

  return (
    <Grid templateColumns="5fr 1fr" gap={6} w="sm" m="100px auto">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Enter show name"
        variant="flushed"
        focusBorderColor="teal.500"
      />
      <IconButton
        onClick={handleSubmit}
        icon="search"
        variant="outline"
        variantColor="teal"
        aria-label="search"
      >
        Go
      </IconButton>
    </Grid>
  );
};

export default SearchField;
