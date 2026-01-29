import { Flex, IconButton, Input, InputGroup } from '@chakra-ui/react';
import { type ChangeEvent, type RefObject, useEffect } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';

type Props = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  inputValue: string;
};

export const SearchInput = ({
  handleChange,
  handleClearInput,
  inputRef,
  inputValue,
}: Props) => {
  const { isMobile } = useResponsiveLayout();

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
      mt={4}
      mb={isMobile ? '16px' : '32px'}
      mx="auto"
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
              color="fg.muted"
              _hover={{ color: 'fg' }}
            >
              <IoClose size="20px" />
            </IconButton>
          )
        }
        startElement={
          <IoSearch
            color="var(--chakra-colors-fg-muted)"
            size="20px"
            style={{ marginLeft: '4px' }}
          />
        }
      >
        <Input
          borderColor="whiteAlpha.200"
          borderRadius="xl"
          fontSize="17px"
          h="56px"
          onChange={handleChange}
          placeholder="Search for TV shows..."
          ref={inputRef}
          value={inputValue}
          variant="outline"
          autoFocus={!isMobile}
          bg="whiteAlpha.50"
          _hover={{ borderColor: 'whiteAlpha.300' }}
          _focus={{
            borderColor: 'cyan.500/60',
            bg: 'whiteAlpha.100',
            boxShadow: '0 0 0 1px var(--chakra-colors-cyan-500)',
          }}
          _placeholder={{ color: 'fg.muted' }}
        />
      </InputGroup>
    </Flex>
  );
};
