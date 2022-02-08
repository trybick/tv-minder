import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Cell, Column } from 'react-table';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, IconButton, Link, Tag, Text, useMediaQuery } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { selectBasicShowInfoForFollowedShows } from 'store/tv/selectors';
import UnfollowCloseButton from './subcomponents/UnfollowCloseButton';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';

export const useTableData = () => {
  const data = useSelector(selectBasicShowInfoForFollowedShows);
  const [isMobile] = useMediaQuery(['(max-width: 768px)']);

  const columns: Column<BasicShowInfo>[] = useMemo(
    () => [
      {
        id: 'name',
        accessor: 'name',
        Header: () => (
          <Text d="inline" ml={isMobile ? '14px' : '38px'}>
            Name
          </Text>
        ),
        Cell: ({ row }: Cell<BasicShowInfo>) => {
          const { isExpanded, getToggleRowExpandedProps, original } = row;
          const toggleRowExpandedProps = getToggleRowExpandedProps();
          return (
            <Flex {...(isMobile && { ...toggleRowExpandedProps })} align="center" gap="16px">
              <IconButton
                {...(!isMobile && { ...toggleRowExpandedProps })}
                aria-label="Expand row"
                icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                ml="-10px"
                size="sm"
                variant="outline"
                isRound
              />
              <Link as={RouterLink} to={`/show/${original.id}`}>
                <Text fontSize="md" isTruncated={!isExpanded}>
                  {original.name}
                </Text>
              </Link>
            </Flex>
          );
        },
      },
    ],
    [isMobile]
  );

  if (!isMobile) {
    columns.push(
      {
        id: 'status',
        Header: 'Status',
        accessor: row => row.statusWithColor.sortOrder,
        width: 119,
        Cell: ({ row }: Cell<BasicShowInfo>) => {
          const { color, status } = row.original.statusWithColor;
          return (
            <Flex align="center" h="100%">
              <Tag {...row.getToggleRowExpandedProps()} colorScheme={color} fontWeight="400">
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
          <Flex align="center" h="100%">
            <Tag {...row.getToggleRowExpandedProps()} fontWeight="400">
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

  return { data, columns };
};
