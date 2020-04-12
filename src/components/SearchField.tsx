import React from 'react';
import { Grid, Button, Input } from '@chakra-ui/core';

const SearchField = (): JSX.Element => {
  const [value, setValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setValue(event.target.value);

  const handleClick = (): void => {
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
      <Button onClick={handleClick} variant="outline" variantColor="teal">
        Go
      </Button>
    </Grid>
  );
};

export default SearchField;
