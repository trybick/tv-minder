import React, { ChangeEvent, RefObject, useEffect } from 'react';
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { Search2Icon, SmallCloseIcon } from '@chakra-ui/icons';
import { PlainFunction } from 'types/common';
interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: PlainFunction;
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
}

const SearchInput = ({ handleChange, handleClearInput, inputRef, inputValue }: Props) => {
  useEffect(() => {
    function clearOnEsc(event: KeyboardEvent) {
      event.key === 'Escape' && handleClearInput();
    }
    document.addEventListener('keydown', clearOnEsc, false);
    return () => {
      document.removeEventListener('keydown', clearOnEsc, false);
    };
  }, [handleClearInput]);

  return (
    <Flex
      direction="column"
      justify="center"
      m="42px auto 30px"
      p="0 25px"
      w={['100%', 'sm', 'md', 'lg']}
    >
      <InputGroup display="flex">
        <InputLeftElement top="9px">
          <Search2Icon color="gray.300" />
        </InputLeftElement>
        <Input
          border="2px solid #0099DB"
          borderRadius="5px"
          fontSize="18px"
          h="60px"
          onChange={handleChange}
          placeholder="Search all shows"
          ref={inputRef}
          size="sm"
          value={inputValue}
          variant="flushed"
          autoFocus
        />
        {inputValue && (
          <InputRightElement right="5px" top="10px">
            <IconButton
              aria-label="Clear input"
              icon={<SmallCloseIcon boxSize="20px" />}
              onClick={handleClearInput}
              size="sm"
              variant="ghost"
            />
          </InputRightElement>
        )}
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
