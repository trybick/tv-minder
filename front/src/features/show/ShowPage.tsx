import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import { getBasicShowInfoAndSeasonsWithEpisodesForCurrentShow } from '~/store/tv/actions';
import { selectCurrentShowInfo } from '~/store/tv/selectors';

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

  useEffect(() => {
    dispatch(getBasicShowInfoAndSeasonsWithEpisodesForCurrentShow());
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
