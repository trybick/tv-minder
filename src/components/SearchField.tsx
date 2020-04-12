import React from 'react';
import { Box, Input } from '@chakra-ui/core';

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
      />
    </Box>
  );
};

export default SearchField;
