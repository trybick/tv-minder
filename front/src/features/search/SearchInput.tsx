import { Flex, IconButton, Input, InputGroup } from '@chakra-ui/react';
import { ChangeEvent, RefObject, useEffect } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';

import { useIsMobile } from '~/hooks/useIsMobile';

type Props = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  inputValue: string;
};

const SearchInput = ({
  handleChange,
  handleClearInput,
  inputRef,
  inputValue,
}: Props) => {
  const isMobile = useIsMobile();

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
          <IoSearch
            color="gray.300"
            size="19px"
            style={{ marginLeft: '3px', top: '9px' }}
          />
        }
      >
        <Input
          borderColor="gray.500"
          borderRadius="5px"
          fontSize="18px"
          h="60px"
          onChange={handleChange}
          placeholder="Find TV shows"
          ref={inputRef}
          value={inputValue}
          variant="outline"
          autoFocus={!isMobile}
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
