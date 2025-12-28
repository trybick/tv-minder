import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import { getShowDetailsWithSeasons } from '~/store/legacy/tv/actions';
import { selectCurrentShowInfo } from '~/store/legacy/tv/selectors';

import ShowContainer from './ShowContainer';

export type ShowNavigationState = {
  posterSource: string;
  name: string;
};

const ShowPage = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const showInfo = useAppSelector(selectCurrentShowInfo);
  const name = window.history.state?.name || showInfo?.name;

  // Scroll to top of page when the page is loaded. This solves this issue of
  // the page loading scrolled down when the previous page was scrolled.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getShowDetailsWithSeasons());
  }, [dispatch]);

  return (
    <>
      <title>{name ? `${name} | TV Minder` : 'TV Minder'}</title>
      <Box
        m={isMobile ? '12px auto 40px' : '24px auto 40px'}
        maxW="800px"
        width="100%"
        px={{ base: '20px', md: '30px' }}
      >
        <ShowContainer />
      </Box>
    </>
  );
};

export default ShowPage;
