import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import styled from '@emotion/styled';
import { useAppDispatch } from 'store';
import { getPopularShowsAction, getTopRatedShowsAction } from 'store/tv/actions';
import { selectPopularShowsForDisplay, selectTopRatedShowsForDisplay } from 'store/tv/selectors';
import PopularShow from './subcomponents/PopularShow';
import { useIsMobile } from '../../hooks/useIsMobile';

const StyledCollapse = styled(Collapse)`
  flex-grow: 1;
`;

const PopularShows = () => {
  const dispatch = useAppDispatch();
  const popularShows = useSelector(selectPopularShowsForDisplay);
  const topRatedShows = useSelector(selectTopRatedShowsForDisplay);
  const isMobile = useIsMobile();
  const { isOpen: isPopularExpanded, onToggle: onTogglePopular } = useDisclosure();
  const { isOpen: isTopRatedExpanded, onToggle: onToggleTopRated } = useDisclosure();

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
        mb="28px"
        textAlign="center"
      >
        Popular TV Shows
      </Heading>
      <Flex
        gap="34px 30px"
        justifyContent={isMobile ? 'center' : 'space-between'}
        mt="14px"
        wrap="wrap"
      >
        {popularShows?.slice(0, numberShowsInFirstRow).map(show => (
          <PopularShow isMobile={isMobile} key={show.id} show={show} />
        ))}
        <StyledCollapse in={isPopularExpanded}>
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
                  <PopularShow isMobile={isMobile} key={show.id} show={show} />
                ))}
            </Flex>
          ))}
        </StyledCollapse>
      </Flex>
      <Flex>
        <Button
          color={useColorModeValue('white', 'gray.800')}
          colorScheme="cyan"
          mt="30px"
          mx="auto"
          onClick={onTogglePopular}
          rightIcon={isPopularExpanded ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
        >
          {isPopularExpanded ? 'Show Less ' : 'Show More'}
        </Button>
      </Flex>

      <Heading
        as="h2"
        color={useColorModeValue('cyan.600', 'cyan.200')}
        fontSize="1.8rem"
        fontWeight="600"
        mb="28px"
        mt={isMobile ? '40px' : '50px'}
        textAlign="center"
      >
        Top Rated TV Shows
      </Heading>
      <Flex
        gap="34px 30px"
        justifyContent={isMobile ? 'center' : 'space-between'}
        mt="14px"
        wrap="wrap"
      >
        {topRatedShows?.slice(0, numberShowsInFirstRow).map(show => (
          <PopularShow isMobile={isMobile} key={show.id} show={show} />
        ))}
        <StyledCollapse in={isTopRatedExpanded}>
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
                  <PopularShow isMobile={isMobile} key={show.id} show={show} />
                ))}
            </Flex>
          ))}
        </StyledCollapse>
      </Flex>
      <Flex>
        <Button
          color={useColorModeValue('white', 'gray.800')}
          colorScheme="cyan"
          mt="30px"
          mx="auto"
          onClick={onToggleTopRated}
          rightIcon={isTopRatedExpanded ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
        >
          {isTopRatedExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </Flex>
    </Box>
  );
};

export default PopularShows;
