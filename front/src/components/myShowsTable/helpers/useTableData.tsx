import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CellProps, Column } from 'react-table';
import { useHistory } from 'react-router-dom';
import { Flex, IconButton, Link, Tag, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { BasicShowInfo } from 'types/external';
import { SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW } from 'store/tv/actions';
import {
  selectBasicShowInfoForFollowedShows,
  selectMyShowsTableExpandedRow,
} from 'store/tv/selectors';
import { ID } from 'types/common';
import { ROUTES } from 'constants/routes';
import { useIsMobile } from 'hooks/useIsMobile';
import UnfollowCloseButton from './subcomponents/UnfollowCloseButton';

export const useTableData = () => {
  const data = useSelector(selectBasicShowInfoForFollowedShows);
  const history = useHistory();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const columns: Column<BasicShowInfo>[] = useMemo(() => {
    const onClickShowName = (showId: ID) => {
      dispatch({ type: SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW, payload: true });
      history.push(`${ROUTES.SHOW}/${showId}`);
    };

    return [
      {
        id: 'name',
        accessor: 'name',
        Header: () => (
          <Text display="inline" ml={isMobile ? '34px' : '58px'}>
            Name
          </Text>
        ),
        Cell: ({ row }: CellProps<BasicShowInfo>) => {
          const myShowsTableExpandedRow = useSelector(selectMyShowsTableExpandedRow);
          const { getToggleRowExpandedProps, original } = row;
          const toggleRowExpandedProps = getToggleRowExpandedProps();
          const isExpanded = myShowsTableExpandedRow === original.id;
          return isMobile ? (
            <Flex {...toggleRowExpandedProps} align="center" gap="14px" h="100%">
              <IconButton
                {...toggleRowExpandedProps}
                aria-label="Expand row"
                icon={
                  isExpanded ? (
                    <ChevronDownIcon {...toggleRowExpandedProps} />
                  ) : (
                    <ChevronRightIcon {...toggleRowExpandedProps} />
                  )
                }
                size="sm"
                variant="outline"
                isRound
              />
              <Link>
                <Text
                  fontSize="md"
                  fontWeight="500"
                  noOfLines={!isExpanded ? 1 : undefined}
                  onClick={() => onClickShowName(original.id)}
                >
                  {original.name}
                </Text>
              </Link>
            </Flex>
          ) : (
            <Flex align="center" gap="16px">
              <IconButton
                aria-label="Expand row"
                icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                size="sm"
                variant="outline"
                isRound
              />
              <Flex align="center" h="100%" ml="10px">
                <Link>
                  <Text
                    fontSize="md"
                    fontWeight="500"
                    noOfLines={!isExpanded ? 1 : undefined}
                    onClick={() => onClickShowName(original.id)}
                  >
                    {original.name}
                  </Text>
                </Link>
              </Flex>
            </Flex>
          );
        },
      },
      {
        id: 'status',
        Header: () => (
          <Text display="inline" ml={isMobile ? '-20px' : 0}>
            Status
          </Text>
        ),
        accessor: row => row.statusWithColor.sortOrder,
        width: 119,
        Cell: ({ row }: CellProps<BasicShowInfo>) => {
          const { original } = row;
          const { color, status } = original.statusWithColor;
          return (
            <Flex align="center" h="100%">
              <Tag colorScheme={color} fontWeight="400" whiteSpace="nowrap">
                {status}
              </Tag>
            </Flex>
          );
        },
      },
    ];
  }, [isMobile, dispatch, history]);

  if (isMobile) {
    columns.splice(1);
  } else {
    columns.push({
      id: 'network',
      Header: 'Network',
      width: 110,
      accessor: row => row.network,
      Cell: ({ row }: CellProps<BasicShowInfo>) => (
        <Flex align="center" cursor="default" h="100%" width="fit-content">
          <Tag fontWeight="400">
            <Text noOfLines={1}>{row.original.network || 'Unlisted'}</Text>
          </Tag>
        </Flex>
      ),
    });
  }

  columns.push({
    id: 'unfollow',
    width: 35,
    Cell: ({ row }: CellProps<BasicShowInfo>) => (
      <UnfollowCloseButton showId={row.original.id} showName={row.original.name} />
    ),
  });

  return { data, columns };
};
