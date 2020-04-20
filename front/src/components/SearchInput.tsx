import React, { ChangeEvent } from 'react';
import { Flex, Input } from '@chakra-ui/core';

interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
}

const SearchInput = ({ handleChange, inputValue }: Props) => (
  <Flex w="xs" direction="column" justify="center" m="100px auto 75px">
    <Input
      value={inputValue}
      onChange={handleChange}
      placeholder="Enter show name"
      variant="flushed"
      focusBorderColor="teal.500"
      size="md"
      isFullWidth={false}
      autoFocus
    />
  </Flex>
);

export default SearchInput;
