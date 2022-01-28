import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Cell, Column } from 'react-table';
import { Button, Flex, Tag, Text, useMediaQuery } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { selectBasicShowInfoForDisplay } from 'store/tv/selectors';
import UnfollowCloseButton from './subcomponents/UnfollowCloseButton';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';

export const useTableData = () => {
  const data = useSelector(selectBasicShowInfoForDisplay);
  const [isLargerThan768] = useMediaQuery(['(min-width: 768px)']);

  const columns: Column<BasicShowInfo>[] = [
    {
      id: 'name',
      accessor: 'name',
      Header: () => (
        <Text d="inline" ml="38px">
          Name
        </Text>
      ),
      Cell: ({ row }: Cell<BasicShowInfo>) => (
        <Button
          {...row.getToggleRowExpandedProps()}
          fontSize="md"
          fontWeight={row.isExpanded ? 500 : 400}
          leftIcon={row.isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          variant="ghost"
        >
          <Text isTruncated={!row.isExpanded}>{row.original.name}</Text>
        </Button>
      ),
    },
  ];

  if (isLargerThan768) {
    columns.push(
      {
        id: 'status',
        Header: 'Status',
        accessor: row => row.statusWithColor.sortOrder,
        width: 119,
        Cell: ({ row }: Cell<BasicShowInfo>) => {
          const { color, status } = row.original.statusWithColor;
          const isBold = status === 'New Episodes' || status === 'Premiering Soon';
          return (
            <Flex align="center" height="100%">
              <Tag
                {...row.getToggleRowExpandedProps()}
                colorScheme={color}
                fontWeight={isBold ? 700 : ''}
              >
                {status}
              </Tag>
            </Flex>
          );
        },
      },
      {
        id: 'network',
        Header: 'Network',
        width: 110,
        accessor: row => row.network,
        Cell: ({ row }: Cell<BasicShowInfo>) => (
          <Flex align="center" height="100%">
            <Tag {...row.getToggleRowExpandedProps()}>
              <Text isTruncated>{row.original.network || 'Unlisted'}</Text>
            </Tag>
          </Flex>
        ),
      }
    );
  }

  columns.push({
    id: 'unfollow',
    width: 35,
    Cell: ({ row }: Cell<BasicShowInfo>) => (
      <UnfollowCloseButton showId={row.original.id} showName={row.original.name} />
    ),
  });

  const memoColumns: Column<BasicShowInfo>[] = useMemo(() => columns, [data, isLargerThan768]);

  return { data, columns: memoColumns };
};
