import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CellProps, Column } from 'react-table';
import { useHistory } from 'react-router-dom';
import { Flex, IconButton, Link, Tag, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { BasicShowInfo } from 'types/external';
import { SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW } from 'store/tv/actions';
import { selectBasicShowInfoForFollowedShows } from 'store/tv/selectors';
import { ROUTES } from 'constants/routes';
import { useIsMobile } from 'hooks/useIsMobile';
import UnfollowCloseButton from './subcomponents/UnfollowCloseButton';

export const useTableData = () => {
  const data = useSelector(selectBasicShowInfoForFollowedShows);
  const history = useHistory();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const columns: Column<BasicShowInfo>[] = useMemo(() => {
    const onClickShowName = (showId: number) => {
      dispatch({ type: SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW, payload: true });
      history.push(`${ROUTES.SHOW}/${showId}`);
    };

    return [
      {
        id: 'status',
        Header: () => (
          <Text display="inline" ml={isMobile ? '34px' : '58px'}>
            Status
          </Text>
        ),
        accessor: row => row.statusWithColor.sortOrder,
        width: 119,
        Cell: ({ row }: CellProps<BasicShowInfo>) => {
          const { isExpanded, getToggleRowExpandedProps, original } = row;
          const { color, status } = original.statusWithColor;
          const toggleRowExpandedProps = getToggleRowExpandedProps();
          return (
            <Flex {...(isMobile && { ...toggleRowExpandedProps })} align="center" gap="16px">
              <IconButton
                {...(!isMobile && { ...toggleRowExpandedProps })}
                aria-label="Expand row"
                icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                size="sm"
                variant="outline"
                isRound
              />
              <Flex align="center" h="100%" ml="10px">
                <Tag {...row.getToggleRowExpandedProps()} colorScheme={color} fontWeight="400">
                  {status}
                </Tag>
              </Flex>
            </Flex>
          );
        },
      },
      {
        id: 'name',
        accessor: 'name',
        Header: () => (
          <Text display="inline" ml={isMobile ? '-20px' : 0}>
            Name
          </Text>
        ),
        Cell: ({ row }: CellProps<BasicShowInfo>) => {
          const { isExpanded, getToggleRowExpandedProps, original } = row;
          const toggleRowExpandedProps = getToggleRowExpandedProps();
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
            <Flex align="center" h="100%">
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
          );
        },
      },
    ];
  }, [isMobile, dispatch, history]);

  if (isMobile) {
    columns.shift();
  } else {
    columns.push({
      id: 'network',
      Header: 'Network',
      width: 110,
      accessor: row => row.network,
      Cell: ({ row }: CellProps<BasicShowInfo>) => (
        <Flex align="center" h="100%">
          <Tag {...row.getToggleRowExpandedProps()} fontWeight="400">
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
