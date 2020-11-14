import React from 'react';
import {
  Flex,
  Image,
  Spinner,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { ShowSearchResult } from 'types/external';
import SearchResults from './subcomponents/SearchResults';
import clock from 'images/clock.png';

interface Props {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: ShowSearchResult[];
  totalResults: number;
}

const LoadingSpinner = () => (
  <Flex justifyContent="center">
    <Spinner />
  </Flex>
);

const EmptyListMessage = () => (
  <Flex justifyContent="center">
    <Text>There are no shows to display</Text>
  </Flex>
);

const WelcomeMessage = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex justifyContent="center" maxW="90%" mt="10px">
      <StatGroup
        alignItems="center"
        bg={colorMode === 'light' ? 'white' : ''}
        borderWidth="1px"
        d="flex"
        flexDirection={{ sm: 'column', lg: 'row' }}
        minH="120px"
        p="16px 26px"
        shadow="md"
      >
        <Stat alignItems="center" d="flex" flexDirection="column">
          <StatLabel fontSize="16px">Start following your favorite shows</StatLabel>
          <StatHelpText fontSize="16px" mt="6px">
            Never miss an episode!
          </StatHelpText>
        </Stat>
        <Image alt="clock logo" height="55px" objectFit="cover" src={clock} />
      </StatGroup>
    </Flex>
  );
};

const SearchContainer = ({ isInputDirty, isLoading, shows, totalResults }: Props) => (
  <Flex justify="center" m="0 auto">
    {isLoading ? (
      <LoadingSpinner />
    ) : shows?.length ? (
      <SearchResults shows={shows} totalResults={totalResults} />
    ) : isInputDirty ? (
      <EmptyListMessage />
    ) : (
      <WelcomeMessage />
    )}
  </Flex>
);

export default SearchContainer;
