import { ChangeEvent, RefObject, useEffect } from 'react';
import { Flex, IconButton, Input, InputGroup } from '@chakra-ui/react';
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
      <InputGroup
        display="flex"
        endElement={
          inputValue && (
            <IconButton
              aria-label="Clear input"
              onClick={handleClearInput}
              size="sm"
              variant="plain"
            >
              <IoClose size="19px" />
            </IconButton>
          )
        }
        startElement={
          <IoSearch color="gray.300" size="19px" style={{ marginLeft: '3px', top: '9px' }} />
        }
      >
        <Input
          _focusVisible={{
            borderColor: '#63b3ed',
            boxShadow: '#63b3ed 0 1px 0',
            outline: 'none',
          }}
          border="2px solid #0099DB"
          borderRadius="5px"
          fontSize="18px"
          h="60px"
          onChange={handleChange}
          placeholder="Search all TV shows"
          ref={inputRef}
          size="sm"
          value={inputValue}
          variant="outline"
          autoFocus
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
