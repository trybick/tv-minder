import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Flex, Heading } from '@chakra-ui/core';
import styled from '@emotion/styled';
import { getPopularShowsAction } from 'store/tv/actions';
import { selectPopularShowsForDisplay } from 'store/tv/selectors';
import SinglePopularShow from './SinglePopularShow';

type FadeWrapperProps = {
  shouldFade: boolean;
};

const FadeWrapper = styled(Flex)<FadeWrapperProps>`
  ${(props: FadeWrapperProps) =>
    props.shouldFade &&
    `
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
`}
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
    <Box height="330px" m="18px 0 30px" maxWidth="86%" position="relative">
      <Heading as="h3" fontSize="1.3rem" fontWeight="600" m="0 18px 25px">
        Popular Now
      </Heading>
      <FadeWrapper
        maxWidth="800px"
        mt="14px"
        overflow="auto"
        ref={scrollWrapperRef}
        shouldFade={shouldFade}
      >
        <Flex justifyContent="center">
          {popularShows?.slice(0, 20).map(show => (
            <SinglePopularShow key={show.id} show={show} />
          ))}
          <Box background="transparent" w="20px" />
        </Flex>
      </FadeWrapper>
    </Box>
  );
};

export default PopularShows;
