import { Box, Grid } from '@chakra-ui/react';

import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
} from '~/store/tv/selectors';

import { AirDates } from './AirDates';
import { Genres } from './Genres';
import { Overview } from './Overview';
import { RatingRow } from './RatingRow';
import { TitleRow } from './TitleRow';
import { Videos } from './richContent/Videos';
import { WatchProviders } from './richContent/WatchProviders';

export const ShowDetails = () => {
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const isLoading = useAppSelector(selectIsLoadingShowDetails);

  const { videos = [], watchProviders, name } = currentShowInfo || {};

  const availableWatchProviders =
    watchProviders &&
    !!(
      watchProviders.flatrate.length ||
      watchProviders.rent.length ||
      watchProviders.buy.length
    )
      ? watchProviders
      : null;

  return (
    <Box
      w="100%"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 5 }}
      minH={isLoading ? { base: '380px', md: '470px' } : undefined}
      borderRadius={{ base: 'xl', md: '2xl' }}
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      bg="linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)"
      boxShadow="0 18px 45px rgba(0, 0, 0, 0.35)"
      backdropFilter="blur(6px)"
    >
      <TitleRow show={currentShowInfo} />
      <RatingRow show={currentShowInfo} />
      <Genres show={currentShowInfo} />
      <Overview show={currentShowInfo} />

      {!isLoading && (
        <>
          <AirDates show={currentShowInfo} />
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gap={4}
            alignItems="start"
          >
            <Box minW={0}>
              <WatchProviders
                showName={name ?? ''}
                watchProviders={availableWatchProviders}
              />
            </Box>
            <Box minW={0}>
              <Videos videos={videos} />
            </Box>
          </Grid>
        </>
      )}
    </Box>
  );
};
