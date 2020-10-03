import React, { ChangeEvent, RefObject } from 'react';
import { Flex, IconButton, Input, InputGroup, InputRightElement, Icon, InputLeftElement } from '@chakra-ui/core';

interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: () => void;
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
}

const SearchInput = ({ handleChange, handleClearInput, inputRef, inputValue }: Props) => (
  <Flex w="xs" direction="column" justify="center" m="100px auto 25px" >
    <InputGroup display="flex">
      <InputLeftElement top="5px" children={<Icon name="search-2" color="gray.300"/>} />
      <Input
        onChange={handleChange}
        placeholder="Enter show name"
        ref={inputRef}
        size="md"
        value={inputValue}
        border="2px solid #0099DB" 
        height="50px"
        borderRadius="5px"
        autoFocus
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
