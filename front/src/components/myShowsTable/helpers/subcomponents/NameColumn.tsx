import React from 'react';
import { chakra, Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { TableExpandedToggleProps } from 'react-table';

interface Props {
  getToggleRowExpandedProps: () => TableExpandedToggleProps;
  isExpanded: boolean;
  showName: string;
}

const NameColumn = ({ getToggleRowExpandedProps, isExpanded, showName }: Props) => (
  <Flex {...getToggleRowExpandedProps()}>
    <chakra.span>
      {isExpanded ? (
        <IconButton
          aria-label="Expand drawer"
          icon={<ChevronDownIcon boxSize="17px" />}
          size="xs"
          variant="ghost"
          isRound
        />
      ) : (
        <IconButton
          aria-label="Expand drawer"
          icon={<ChevronRightIcon boxSize="17px" />}
          size="xs"
          variant="ghost"
          isRound
        />
      )}
    </chakra.span>
    <Text
      fontSize={isExpanded ? 'xl' : 'md'}
      fontWeight={isExpanded ? 500 : 400}
      isTruncated={!isExpanded}
      ml="12px"
    >
      {showName}
    </Text>
  </Flex>
);

export default NameColumn;
