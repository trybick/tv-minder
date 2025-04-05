import { ChangeEvent, RefObject, useEffect } from 'react';
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { IoClose, IoSearch } from 'react-icons/io5';
import { PlainFunction } from 'types/common';
type Props = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: PlainFunction;
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
};

const SearchInput = ({ handleChange, handleClearInput, inputRef, inputValue }: Props) => {
  useEffect(() => {
    function clearOnEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClearInput();
      }
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
      m="58px auto 40px"
      p="0 25px"
      w={['100%', 'sm', 'md', 'lg']}
    >
      <InputGroup display="flex">
        <InputLeftElement ml="3px" top="9px">
          <IoSearch color="gray.300" size="19px" />
        </InputLeftElement>
        <Input
          border="2px solid #0099DB"
          borderRadius="5px"
          fontSize="18px"
          h="60px"
          onChange={handleChange}
          placeholder="Search all TV shows"
          ref={inputRef}
          size="sm"
          value={inputValue}
          variant="flushed"
          autoFocus
        />
        {inputValue && (
          <InputRightElement right="6px" top="10px">
            <IconButton
              aria-label="Clear input"
              onClick={handleClearInput}
              size="sm"
              variant="ghost"
            >
              <IoClose size="19px" />
            </IconButton>
          </InputRightElement>
        )}
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
