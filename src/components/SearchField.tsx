import React from 'react';
import { Box, Button, Input } from '@chakra-ui/core';

const SearchField = (): JSX.Element => {
  const [value, setValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setValue(event.target.value);

  return (
    <Box w="md" m="100px auto">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Enter a show name"
        variant="flushed"
        focusBorderColor="teal.500"
      />
      <Button variant="outline" variantColor="teal">
        Go
      </Button>
    </Box>
  );
};

export default SearchField;
