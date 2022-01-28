import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Cell, Column } from 'react-table';
import { Tag, Text, useMediaQuery } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { selectBasicShowInfoForDisplay } from 'store/tv/selectors';
import NameColumn from './subcomponents/NameColumn';
import UnfollowCloseButton from './subcomponents/UnfollowCloseButton';

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
        <NameColumn
          getToggleRowExpandedProps={row.getToggleRowExpandedProps}
          isExpanded={row.isExpanded}
          showName={row.original.name}
        />
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
            <Tag
              {...row.getToggleRowExpandedProps()}
              colorScheme={color}
              fontWeight={isBold ? 700 : ''}
            >
              {status}
            </Tag>
          );
        },
      },
      {
        id: 'network',
        Header: 'Network',
        width: 110,
        accessor: row => row.network,
        Cell: ({ row }: Cell<BasicShowInfo>) => (
          <Tag {...row.getToggleRowExpandedProps()}>{row.original.network || 'Unlisted'}</Tag>
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
