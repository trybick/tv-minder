import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Container, Heading } from '@chakra-ui/react';
import { useAppDispatch } from 'store';
import { getPopularShowsAction, getTopRatedShowsAction } from 'store/tv/actions';
import { selectPopularShowsForDisplay, selectTopRatedShowsForDisplay } from 'store/tv/selectors';
import { useIsMobile } from 'hooks/useIsMobile';
import Carousel from 'components/common/carousel/carousel';
import PopularShow from './subcomponents/PopularShow';

const PopularShows = () => {
  const dispatch = useAppDispatch();
  const popularShows = useSelector(selectPopularShowsForDisplay);
  const topRatedShows = useSelector(selectTopRatedShowsForDisplay);
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(getPopularShowsAction());
    dispatch(getTopRatedShowsAction());
  }, [dispatch]);

  return (
    <Box h="330px" m="18px 0 30px" maxW="100%" position="relative">
      <Heading
        as="h2"
        fontSize="1.45em"
        fontWeight="600"
        m="0 18px 18px 24px"
        textAlign={isMobile ? 'center' : 'left'}
      >
        Popular Now
      </Heading>
      <Container
        maxW={{
          base: '100%',
          sm: '35rem',
          md: '43.75rem',
          lg: '57.5rem',
          xl: '75rem',
          xxl: '87.5rem',
        }}
      >
        <Carousel gap={20} itemWidth={144}>
          {popularShows?.slice(0, 20).map(show => (
            <PopularShow key={show.id} show={show} />
          ))}
        </Carousel>
      </Container>
      <Heading
        as="h2"
        fontSize="1.45em"
        fontWeight="600"
        m="20px 18px 18px 24px"
        textAlign={isMobile ? 'center' : 'left'}
      >
        Top Rated
      </Heading>
      <Container
        maxW={{
          base: '100%',
          sm: '35rem',
          md: '43.75rem',
          lg: '57.5rem',
          xl: '75rem',
          xxl: '87.5rem',
        }}
      >
        <Carousel gap={20} itemWidth={144}>
          {topRatedShows?.slice(0, 20).map(show => (
            <PopularShow key={show.id} show={show} />
          ))}
        </Carousel>
      </Container>
    </Box>
  );
};

export default PopularShows;
