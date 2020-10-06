import React from 'react';
import {
  Flex,
  Spinner,
  Text,
  Stat,
  StatLabel,
  StatHelpText,
  Image,
  StatGroup,
  useColorMode
} from '@chakra-ui/core';
import { ShowSearchResult } from 'types/external';
import SearchResults from './subcomponents/SearchResults';
import clock from '../../images/clock.png'

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
    <Flex justifyContent="center">
      <StatGroup
        bg={colorMode === 'light' ? 'white' : ''}
        d="flex"
        alignItems="center"
        flexDirection={{ sm: 'column', lg: 'row' }}
        borderWidth="1px"
        padding="10px"
        shadow="sm"
        minHeight="120px"
      >
        <Stat d="flex" flexDirection="column" alignItems="center">
          <StatLabel>Keep track of your favorite shows.</StatLabel>
          <StatHelpText>Search for a show now!</StatHelpText>
        </Stat>
        <Image alt="alt clock logo" height="80px" objectFit='cover' src={clock} />
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
