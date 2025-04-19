import {
  Box,
  Button,
  Collapsible,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { useSelector } from 'react-redux';

import { useColorModeValue } from '~/components/ui/color-mode';
import { useAppDispatch } from '~/store';
import {
  getPopularShowsAction,
  getTopRatedShowsAction,
} from '~/store/tv/actions';
import {
  selectPopularShowsForDisplay,
  selectTopRatedShowsForDisplay,
} from '~/store/tv/selectors';

import { useIsMobile } from '../../hooks/useIsMobile';

import PopularShow from './subcomponents/PopularShow';

const PopularShows = () => {
  const dispatch = useAppDispatch();
  const popularShows = useSelector(selectPopularShowsForDisplay);
  const topRatedShows = useSelector(selectTopRatedShowsForDisplay);
  const isMobile = useIsMobile();
  const { open: isPopularExpanded, onToggle: onTogglePopular } =
    useDisclosure();
  const { open: isTopRatedExpanded, onToggle: onToggleTopRated } =
    useDisclosure();

  useEffect(() => {
    dispatch(getPopularShowsAction());
    dispatch(getTopRatedShowsAction());
  }, [dispatch]);

  const numberShowsInFirstRow =
    useBreakpointValue(
      {
        base: 2,
        md: 3,
        lg: 4,
        xl: 5,
        '2xl': 6,
      },
      { ssr: false }
    ) || 2;
  const numberRowsToRender = popularShows?.length
    ? Math.ceil(popularShows.length / numberShowsInFirstRow) - 1
    : 2;

  return (
    <Box m="18px 0 30px" maxW="1500px" w="95%">
      <Heading
        as="h2"
        color={useColorModeValue('cyan.600', 'cyan.200')}
        fontSize="1.8rem"
        fontWeight="600"
        mb="32px"
      >
        Popular
      </Heading>
      <Flex
        gap="34px 30px"
        justifyContent={isMobile ? 'center' : 'space-between'}
        mt="14px"
        wrap="wrap"
      >
        {popularShows
          ?.slice(0, numberShowsInFirstRow)
          .map(show => (
            <PopularShow isMobile={isMobile} key={show.id} show={show} />
          ))}

        <Collapsible.Root flexGrow={1} open={isPopularExpanded}>
          <Collapsible.Content>
            {[...Array(numberRowsToRender).keys()].map(i => (
              <Flex
                _notLast={{
                  justifyContent: isMobile ? 'center' : 'space-between',
                  marginBottom: '34px',
                }}
                columnGap="30px"
                key={`row-${i}`}
              >
                {popularShows
                  ?.slice(
                    (i + 1) * numberShowsInFirstRow,
                    (i + 1) * numberShowsInFirstRow + numberShowsInFirstRow
                  )
                  .map(show => (
                    <PopularShow
                      isMobile={isMobile}
                      key={show.id}
                      show={show}
                    />
                  ))}
              </Flex>
            ))}
          </Collapsible.Content>
        </Collapsible.Root>
      </Flex>
      <Flex>
        {!isPopularExpanded && (
          <Button
            colorPalette="cyan"
            mt="30px"
            mx="auto"
            onClick={onTogglePopular}
            variant="plain"
          >
            <Text fontSize="15px">See More</Text>
            <AiOutlineCaretDown style={{ width: '15px' }} />
          </Button>
        )}
      </Flex>

      <Heading
        as="h2"
        color={useColorModeValue('cyan.600', 'cyan.200')}
        fontSize="1.8rem"
        fontWeight="600"
        mb="32px"
        mt={isMobile ? '40px' : '50px'}
      >
        Top Rated
      </Heading>
      <Flex
        gap="34px 30px"
        justifyContent={isMobile ? 'center' : 'space-between'}
        mt="14px"
        wrap="wrap"
      >
        {topRatedShows
          ?.slice(0, numberShowsInFirstRow)
          .map(show => (
            <PopularShow isMobile={isMobile} key={show.id} show={show} />
          ))}
        <Collapsible.Root flexGrow={1} open={isTopRatedExpanded}>
          <Collapsible.Content>
            {[...Array(numberRowsToRender).keys()].map(i => (
              <Flex
                _notLast={{
                  justifyContent: isMobile ? 'center' : 'space-between',
                  marginBottom: '34px',
                }}
                columnGap="30px"
                key={`row-${i}`}
              >
                {topRatedShows
                  ?.slice(
                    (i + 1) * numberShowsInFirstRow,
                    (i + 1) * numberShowsInFirstRow + numberShowsInFirstRow
                  )
                  .map(show => (
                    <PopularShow
                      isMobile={isMobile}
                      key={show.id}
                      show={show}
                    />
                  ))}
              </Flex>
            ))}
          </Collapsible.Content>
        </Collapsible.Root>
      </Flex>
      <Flex>
        {!isTopRatedExpanded && (
          <Button
            colorPalette="cyan"
            mt="30px"
            mx="auto"
            onClick={onToggleTopRated}
            variant="plain"
          >
            <Text fontSize="15px">See More</Text>
            <AiOutlineCaretDown style={{ width: '15px' }} />
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default PopularShows;
