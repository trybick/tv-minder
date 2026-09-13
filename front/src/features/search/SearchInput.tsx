import { Flex, IconButton, Input, InputGroup } from '@chakra-ui/react';
import {
  type ChangeEvent,
  type FormEvent,
  type RefObject,
  useEffect,
} from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { passwordManagerIgnoreProps } from '~/utils/passwordManagerIgnore';

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
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [inputRef, isMobile]);

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

  const handleSubmit = (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Flex
      as="form"
      role="search"
      onSubmit={handleSubmit}
      direction="column"
      justify="center"
      mt={4}
      mb={isMobile ? 4 : 5}
      mx="auto"
      maxW="1500px"
      px={{ base: 0, md: 6 }}
      w={{ base: '95%', sm: 'sm', md: 'md', lg: 'lg' }}
    >
      <InputGroup
        display="flex"
        endElement={
          inputValue ? (
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
          ) : undefined
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
          type="search"
          name="show-search"
          aria-label="Search for TV shows"
          {...passwordManagerIgnoreProps}
          borderColor="whiteAlpha.200"
          borderRadius="xl"
          fontSize="17px"
          h="56px"
          onChange={handleChange}
          placeholder="Search for TV shows..."
          ref={inputRef}
          value={inputValue}
          variant="outline"
          css={{
            '&::-webkit-search-cancel-button, &::-webkit-search-decoration': {
              WebkitAppearance: 'none',
            },
          }}
          bg="whiteAlpha.50"
          shadow="sm"
          transitionProperty="border-color, background, box-shadow"
          transitionDuration="fast"
          _hover={{ borderColor: 'whiteAlpha.300', bg: 'whiteAlpha.100' }}
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
