import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

import { ShowNavigationState } from '~/components/search/subcomponents/SearchResult';
import ShowContainer from '~/components/showContainer/ShowContainer';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch } from '~/store';
import { getBasicShowInfoAndSeasonsWithEpisodesForCurrentShow } from '~/store/tv/actions';

const ShowPage = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  const { state } = window.history;
  const { showId, name } = state as ShowNavigationState;

  useEffect(() => {
    dispatch(getBasicShowInfoAndSeasonsWithEpisodesForCurrentShow(showId));
  }, [dispatch, showId]);

  return (
    <>
      <title>{name ? `${name} | TV Minder` : 'TV Minder'}</title>
      <Box
        m={isMobile ? '12px auto 40px' : '24px auto 40px'}
        maxW="800px"
        px={{ base: '20px', md: '30px' }}
      >
        <ShowContainer />
      </Box>
    </>
  );
};

export default ShowPage;
