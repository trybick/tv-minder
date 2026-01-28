import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useParams } from 'wouter';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import { getShowDetailsWithSeasons } from '~/store/tv/actions';
import { selectCurrentShowInfo } from '~/store/tv/selectors';
import { addRecentShow } from '~/utils/recentShows';

import { ShowContainer } from './ShowContainer';

export const ShowPage = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const { showId } = useParams<{ showId: string }>();
  const showInfo = useAppSelector(selectCurrentShowInfo);
  const name = window.history.state?.name || showInfo?.name;

  // Scroll to top of page when the page is loaded or show changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showId]);

  useEffect(() => {
    dispatch(getShowDetailsWithSeasons());
  }, [dispatch, showId]);

  // Track recent show visits
  useEffect(() => {
    if (showInfo?.id && showInfo?.name) {
      addRecentShow({
        id: showInfo.id,
        name: showInfo.name,
        posterPath: showInfo.posterPath,
      });
    }
  }, [showInfo?.id, showInfo?.name, showInfo?.posterPath]);

  return (
    <>
      <title>{name ? `${name} | TV Minder` : 'TV Minder'}</title>
      <Box
        m={isMobile ? '0 auto 40px' : '24px auto 40px'}
        maxW="800px"
        width="100%"
        px={{ base: '20px', md: '30px' }}
      >
        <ShowContainer />
      </Box>
    </>
  );
};
