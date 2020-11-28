import React, { ChangeEvent, RefObject } from 'react';
import {
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/core';
import { PlainFunction } from 'types/common';
interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: PlainFunction;
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
}

const SearchInput = ({ handleChange, handleClearInput, inputRef, inputValue }: Props) => (
  <Flex
    direction="column"
    justify="center"
    m="40px auto 30px"
    p="0 25px"
    w={['100%%', 'sm', 'md', 'lg']}
  >
    <InputGroup display="flex">
      <InputLeftElement top="5px">
        <Icon color="gray.300" name="search-2" />
      </InputLeftElement>
      <Input
        border="2px solid #0099DB"
        borderRadius="5px"
        height="50px"
        onChange={handleChange}
        placeholder="Search for a tv show"
        ref={inputRef}
        size="sm"
        value={inputValue}
        variant="flushed"
        autoFocus
      />
      {inputValue && (
        <InputRightElement right="5px" top="5px">
          <IconButton
            aria-label="Clear input"
            icon="small-close"
            onClick={handleClearInput}
            size="md"
            variant="ghost"
          />
        </InputRightElement>
      )}
    </InputGroup>
  </Flex>
);

export default SearchInput;
