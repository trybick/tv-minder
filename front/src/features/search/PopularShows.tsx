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

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  getPopularShowsAction,
  getTopRatedShowsAction,
} from '~/store/tv/actions';
import {
  selectPopularShowsForDisplay,
  selectTopRatedShowsForDisplay,
} from '~/store/tv/selectors';
import { applyViewTransition } from '~/utils/applyViewTransition';

import PopularShow from './PopularShow';

const PopularShows = () => {
  const dispatch = useAppDispatch();
  const popularShows = useAppSelector(selectPopularShowsForDisplay);
  const topRatedShows = useAppSelector(selectTopRatedShowsForDisplay);
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

  const handleTogglePopular = () => {
    applyViewTransition(onTogglePopular);
  };

  const handleToggleTopRated = () => {
    applyViewTransition(onToggleTopRated);
  };

  return (
    <Box m="18px 0 30px" maxW="1500px" w="95%">
      <Heading
        as="h2"
        color="fg.subtle"
        fontSize="4xl"
        fontWeight="600"
        mb="26px"
      >
        Popular
      </Heading>
      <Flex
        gap="34px 30px"
        justifyContent={isMobile ? 'center' : 'space-between'}
        mt="14px"
        wrap="wrap"
      >
        {popularShows?.slice(0, numberShowsInFirstRow).map(show => (
          <PopularShow key={show.id} show={show} />
        ))}

        <Collapsible.Root
          flexGrow={1}
          open={isPopularExpanded}
          // Needed to add `position:absolute` when it's not expanded to avoid
          // this element from coutning as a flex child resulting in un-centering
          // the other items.
          position={isPopularExpanded ? 'unset' : 'absolute'}
        >
          <Collapsible.Content>
            {[...Array(numberRowsToRender).keys()].map(i => (
              <Flex
                justifyContent={isMobile ? 'center' : 'space-between'}
                _last={{ justifyContent: 'flex-start' }}
                marginBottom="34px"
                columnGap="30px"
                key={`row-${i}`}
              >
                {popularShows
                  ?.slice(
                    (i + 1) * numberShowsInFirstRow,
                    (i + 1) * numberShowsInFirstRow + numberShowsInFirstRow
                  )
                  .map(show => (
                    <PopularShow key={show.id} show={show} />
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
            onClick={handleTogglePopular}
            variant="plain"
          >
            <Text
              fontSize="17px"
              _hover={{
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              See More
            </Text>
            <AiOutlineCaretDown style={{ width: '15px' }} />
          </Button>
        )}
      </Flex>

      <Heading
        as="h2"
        color="fg.subtle"
        fontSize="4xl"
        fontWeight="600"
        mb="26px"
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
        {topRatedShows?.slice(0, numberShowsInFirstRow).map(show => (
          <PopularShow key={show.id} show={show} />
        ))}

        <Collapsible.Root
          flexGrow={1}
          open={isTopRatedExpanded}
          position={isTopRatedExpanded ? 'unset' : 'absolute'}
        >
          <Collapsible.Content>
            {[...Array(numberRowsToRender).keys()].map(i => (
              <Flex
                justifyContent={isMobile ? 'center' : 'space-between'}
                _last={{ justifyContent: 'flex-start' }}
                marginBottom="34px"
                columnGap="30px"
                key={`row-${i}`}
              >
                {topRatedShows
                  ?.slice(
                    (i + 1) * numberShowsInFirstRow,
                    (i + 1) * numberShowsInFirstRow + numberShowsInFirstRow
                  )
                  .map(show => (
                    <PopularShow key={show.id} show={show} />
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
            onClick={handleToggleTopRated}
            variant="plain"
          >
            <Text
              fontSize="17px"
              _hover={{
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              See More
            </Text>
            <AiOutlineCaretDown style={{ width: '15px' }} />
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default PopularShows;
