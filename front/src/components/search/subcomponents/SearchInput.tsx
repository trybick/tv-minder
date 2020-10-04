import React, { ChangeEvent, RefObject } from 'react';
import { Flex, IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/core';

interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: () => void;
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
}

const SearchInput = ({ handleChange, handleClearInput, inputRef, inputValue }: Props) => (
  <Flex direction="column" justify="center" m="100px auto 25px" w="xs">
    <InputGroup>
      <Input
        autoFocus
        focusBorderColor="primary"
        onChange={handleChange}
        placeholder="Enter show name"
        ref={inputRef}
        size="md"
        value={inputValue}
        variant="flushed"
      />
      {inputValue && (
        <InputRightElement
          children={
            <IconButton
              aria-label="Clear input"
              icon="small-close"
              onClick={handleClearInput}
              size="sm"
              variant="ghost"
            />
          }
        />
      )}
    </InputGroup>
  </Flex>
);

export default SearchInput;
