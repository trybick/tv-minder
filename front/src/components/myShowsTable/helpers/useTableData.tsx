import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CellProps, Column, HeaderProps } from 'react-table';
import { useHistory } from 'react-router-dom';
import {
  chakra,
  Flex,
  Icon,
  Image,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  Text,
} from '@chakra-ui/react';
import { BiInfoCircle } from 'react-icons/bi';
import { BasicShowInfo } from 'types/external';
import { SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW } from 'store/tv/actions';
import { selectBasicShowInfoForFollowedShows } from 'store/tv/selectors';
import { ID, PlainFunction } from 'types/common';
import { ROUTES } from 'constants/routes';
import { fallbackImagePath, imagePath154 } from 'constants/strings';
import { maybePluralize } from 'utils/formatting';
import { useIsMobile } from 'hooks/useIsMobile';
import UnfollowCloseButton from '../UnfollowCloseButton';

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
        accessor: name => name.toString(),
        Header: ({ onClick }: HeaderProps<BasicShowInfo> & { onClick?: PlainFunction }) => (
          <Text cursor="pointer" ml={isMobile ? '-20px' : '94px'} onClick={onClick}>
            TV Show
          </Text>
        ),
        Cell: ({ row }: CellProps<BasicShowInfo>) => {
          const { id, name, numEpisodes, numSeasons, posterPath } = row.original;

          return isMobile ? (
            <Flex align="center" gap="14px" h="100%">
              <Link>
                <Text
                  fontSize="md"
                  fontWeight="500"
                  noOfLines={1}
                  onClick={() => onClickShowName(id)}
                >
                  {name}
                </Text>
              </Link>
            </Flex>
          ) : (
            <Flex align="center" gap="20px">
              <Image
                alt={`${name}-image`}
                borderRadius="5px"
                cursor="pointer"
                fallbackSrc={fallbackImagePath}
                fallbackStrategy="onError"
                h="150px"
                onClick={() => onClickShowName(id)}
                src={posterPath ? imagePath154 + posterPath : fallbackImagePath}
              />
              <Flex direction="column" h="100%">
                <Link mb="5px">
                  <Text
                    fontSize="22px"
                    fontWeight="500"
                    noOfLines={1}
                    onClick={() => onClickShowName(id)}
                  >
                    {name}
                  </Text>
                </Link>
                <Text fontSize="15px">
                  {numSeasons} {maybePluralize(numSeasons, 'season')}
                </Text>
                <Text fontSize="15px">
                  {numEpisodes} {maybePluralize(numEpisodes, 'episode')}
                </Text>
              </Flex>
            </Flex>
          );
        },
      },
      {
        id: 'status',
        Header: ({ onClick }: HeaderProps<BasicShowInfo> & { onClick?: PlainFunction }) => (
          <Flex align="center">
            <Text cursor="pointer" ml={isMobile ? '-20px' : 0} onClick={onClick}>
              Status
            </Text>
            <Popover placement="bottom" trigger="click">
              <PopoverTrigger>
                <chakra.button display="flex">
                  <Icon as={BiInfoCircle} boxSize="15px" ml="2px" />
                </chakra.button>
              </PopoverTrigger>
              <PopoverContent minW={{ base: '100%', md: 'max-content' }} textTransform="none">
                <PopoverArrow />
                <PopoverBody padding="14px">
                  <Flex flexDirection="column" gap="20px">
                    <Flex align="center" gap="10px">
                      <Tag
                        colorScheme="green"
                        justifyContent="center"
                        whiteSpace="nowrap"
                        width="136px"
                      >
                        Active Season
                      </Tag>
                      <Text fontWeight="600">New episodes currently airing</Text>
                    </Flex>
                    <Flex align="center" gap="10px">
                      <Tag
                        colorScheme="purple"
                        justifyContent="center"
                        whiteSpace="nowrap"
                        width="136px"
                      >
                        Premiering Soon
                      </Tag>
                      <Text fontWeight="600">New season coming soon</Text>
                    </Flex>
                    <Flex align="center" gap="10px">
                      <Tag
                        colorScheme="blue"
                        justifyContent="center"
                        whiteSpace="nowrap"
                        width="136px"
                      >
                        In Production
                      </Tag>
                      <Text fontWeight="600">New season will be released in future</Text>
                    </Flex>
                    <Flex align="center" gap="10px">
                      <Tag
                        colorScheme="red"
                        justifyContent="center"
                        whiteSpace="nowrap"
                        width="136px"
                      >
                        Ended
                      </Tag>
                      <Text fontWeight="600">Production has stopped permanently</Text>
                    </Flex>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        ),
        accessor: row => row.statusWithColor.sortOrder,
        width: 119,
        Cell: ({ row }: CellProps<BasicShowInfo>) => {
          const { original } = row;
          const { color, status } = original.statusWithColor;
          return (
            <Flex align="center" cursor="default" h="100%" justifyContent="center" w="100%">
              <Tag
                colorScheme={color}
                justifyContent="center"
                size="lg"
                w="147px"
                whiteSpace="nowrap"
              >
                {status}
              </Tag>
            </Flex>
          );
        },
      },
      {
        id: 'network',
        Header: ({ onClick }: HeaderProps<BasicShowInfo> & { onClick?: PlainFunction }) => (
          <Text cursor="pointer" onClick={onClick}>
            Network
          </Text>
        ),
        width: isMobile ? 100 : 110,
        accessor: row => row.network,
        Cell: ({ row }: CellProps<BasicShowInfo>) => (
          <Flex
            align="center"
            cursor="default"
            h="100%"
            justifyContent={isMobile ? 'left' : 'center'}
            width="100%"
          >
            <Text
              fontSize={isMobile ? 'md' : 'lg'}
              fontWeight={isMobile ? '400' : '600'}
              noOfLines={1}
            >
              {row.original.network || 'Unlisted'}
            </Text>
          </Flex>
        ),
      },
      {
        id: 'unfollow',
        width: 35,
        Cell: ({ row }: CellProps<BasicShowInfo>) => (
          <UnfollowCloseButton showId={row.original.id} showName={row.original.name} />
        ),
      },
    ];
  }, [isMobile, dispatch, history]);

  if (isMobile) {
    // Remove 'Status' column
    columns.splice(1, 1);
  }

  return { data, columns };
};
