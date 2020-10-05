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
} from '@chakra-ui/core';
import { ShowSearchResult } from 'types/external';
import SearchResults from './subcomponents/SearchResults';
import logo from '../../images/logo.svg';

interface Props {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: ShowSearchResult[];
  totalResults: number;
  colorMode: 'light' | 'dark';
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

const WelcomeMessage = ({ colorMode }: Pick<Props, 'colorMode'>) => (
  <Flex justifyContent="center">
    <StatGroup
      bg={colorMode === 'light' ? 'white' : ''}
      d="flex"
      alignItems="center"
      flexDirection={{ sm: 'column', lg: 'row' }}
      borderWidth="1px"
      padding="15px"
      shadow="sm"
      minHeight="125px"
    >
      <Stat d="flex" flexDirection="column" alignItems="center">
        <StatLabel>Keep track of your favorite shows with this app</StatLabel>
        <StatHelpText>Search for a show now !</StatHelpText>
      </Stat>
      <Image alt="logo" height="35px" src={logo} />
    </StatGroup>
  </Flex>
);

const SearchContainer = ({ isInputDirty, isLoading, shows, totalResults, colorMode }: Props) => (
  <Flex justify="center" m="0 auto">
    {isLoading ? (
      <LoadingSpinner />
    ) : shows?.length ? (
      <SearchResults shows={shows} totalResults={totalResults} />
    ) : isInputDirty ? (
      <EmptyListMessage />
    ) : (
      <WelcomeMessage colorMode={colorMode} />
    )}
  </Flex>
);

export default SearchContainer;
