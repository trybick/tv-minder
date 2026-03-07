import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useParams } from 'wouter';

import { ROUTES } from '~/app/routes';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppDispatch, useAppSelector } from '~/store';
import { addRecentShow } from '~/store/rtk/slices/recentShows.slice';
import { getShowDetailsWithSeasons } from '~/store/tv/actions';
import { selectCurrentShowInfo } from '~/store/tv/selectors';

import { ShowContainer } from './ShowContainer';
import { SimilarShows } from './SimilarShows';

export const ShowPage = () => {
  const dispatch = useAppDispatch();
  const [, navigate] = useLocation();
  const { isMobile } = useResponsiveLayout();
  const { showId } = useParams<{ showId: string }>();
  const showInfo = useAppSelector(selectCurrentShowInfo);
  const name = window.history.state?.name || showInfo?.name;

  // Scroll to top of page when the page is loaded. This solves this issue of
  // the page loading scrolled down when the previous page was scrolled.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showId]);

  useEffect(() => {
    const parsedId = Number(showId);
    if (!showId || !Number.isInteger(parsedId) || parsedId <= 0) {
      navigate(ROUTES.HOME);
      return;
    }
    dispatch(getShowDetailsWithSeasons(parsedId));
  }, [dispatch, showId, navigate]);

  useEffect(() => {
    if (showInfo?.id && showInfo?.name) {
      dispatch(
        addRecentShow({
          id: showInfo.id,
          name: showInfo.name,
          posterPath: showInfo.posterPath,
        })
      );
    }
  }, [dispatch, showInfo?.id, showInfo?.name, showInfo?.posterPath]);

  return (
    <>
      <title>{name ? `${name} | TV Minder` : 'TV Minder'}</title>
      <Box
        m={isMobile ? '0 auto 40px' : '24px auto 40px'}
        maxW="1050px"
        width="100%"
        px={{ base: '20px', md: '30px' }}
      >
        <ShowContainer />
        <SimilarShows />
      </Box>
    </>
  );
};
