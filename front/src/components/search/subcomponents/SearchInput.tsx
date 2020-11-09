import React, { ChangeEvent, RefObject } from 'react';
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/core';
import { Search2Icon, SmallCloseIcon } from '@chakra-ui/icons';
import { PlainFunction } from 'types/common';

interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: PlainFunction;
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
}

const SearchInput = ({ handleChange, handleClearInput, inputRef, inputValue }: Props) => (
  <Flex direction="column" justify="center" m="100px auto 25px" maxW="90%" w="xs">
    <InputGroup display="flex">
      <InputLeftElement top="5px">
        <Search2Icon color="gray.300" />
      </InputLeftElement>
      <Input
        border="2px solid #0099DB"
        borderRadius="5px"
        height="50px"
        onChange={handleChange}
        placeholder="Enter show name"
        ref={inputRef}
        size="md"
        value={inputValue}
        variant="flushed"
        autoFocus
      />
      {inputValue && (
        <InputRightElement right="5px" top="5px">
          <IconButton
            aria-label="Clear input"
            icon={<SmallCloseIcon />}
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
