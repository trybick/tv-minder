import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { getPopularShowsAction } from 'store/tv/actions';
import { selectPopularShowsForDisplay } from 'store/tv/selectors';
import PopularShow from './subcomponents/PopularShow';

const fadeCss = css`
  &:after {
    content: '';
    position: absolute;
    bottom: -17px;
    right: 0;
    top: 50px;
    width: 50px;
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 100%
    );
    will-change: opacity;
  }
`;

const PopularShows = () => {
  const dispatch = useDispatch();
  const popularShows = useSelector(selectPopularShowsForDisplay);
  useEffect(() => {
    dispatch(getPopularShowsAction());
  }, [dispatch]);

  // Handle hiding the fade effect on the last show
  const [shouldFade, setShouldFade] = useState(true);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ref = scrollWrapperRef;
    function handleHoriztonalScroll(event: any) {
      const isScrollAtEnd = event.srcElement.scrollLeft > 2410;
      isScrollAtEnd ? setShouldFade(false) : setShouldFade(true);
    }
    ref.current?.addEventListener('scroll', handleHoriztonalScroll);
    return function cleanup() {
      ref.current?.removeEventListener('scroll', handleHoriztonalScroll);
    };
  });

  return (
    <Box h="330px" m="18px 0 30px" maxW="100%" position="relative">
      <Heading as="h2" fontSize="1.3rem" fontWeight="600" m="0 18px 25px">
        Popular Now
      </Heading>
      <Flex
        css={shouldFade && fadeCss}
        maxW="800px"
        mt="14px"
        overflow="auto"
        ref={scrollWrapperRef}
      >
        <Flex justifyContent="center">
          {popularShows?.slice(0, 20).map(show => (
            <PopularShow key={show.id} show={show} />
          ))}
          <Box bg="transparent" w="20px" />
        </Flex>
      </Flex>
    </Box>
  );
};

export default PopularShows;
