import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import styled from '@emotion/styled';
import { useAppDispatch } from 'store';
import { getPopularShowsAction } from 'store/tv/actions';
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
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    dispatch(getPopularShowsAction());
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
  const numberRowsToRender = Math.ceil(popularShows.length / numberShowsInFirstRow) - 1;

  return (
    <Box m="18px 0 30px" maxW="1500px" w="95%">
      <Heading
        as="h2"
        fontSize="1.9rem"
        fontWeight="600"
        mb="22px"
        mx="4px"
        textAlign={isMobile ? 'center' : 'left'}
      >
        Popular Shows
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
        <StyledCollapse in={isOpen}>
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
          mt="20px"
          mx="auto"
          onClick={onToggle}
          rightIcon={isOpen ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
        >
          {isOpen ? 'Less ' : 'More Popular Shows'}
        </Button>
      </Flex>

      <Heading
        as="h2"
        fontSize="1.9rem"
        fontWeight="600"
        mb="22px"
        mt={isMobile ? '40px' : '30px'}
        mx="4px"
        textAlign={isMobile ? 'center' : 'left'}
      >
        Top Rated Shows
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
        <StyledCollapse in={isOpen}>
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
          mt="20px"
          mx="auto"
          onClick={onToggle}
          rightIcon={isOpen ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
        >
          {isOpen ? 'Less' : 'More Top Rated Shows'}
        </Button>
      </Flex>
    </Box>
  );
};

export default PopularShows;
