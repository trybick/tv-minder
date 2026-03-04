import { Box, Flex, Grid, Skeleton } from '@chakra-ui/react';

import { useSkeletonDelay } from '~/hooks/useSkeletonDelay';
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

  const shouldShowSkeleton = useSkeletonDelay(isLoading);

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

      {isLoading ? (
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={4}
          alignItems="start"
          visibility={shouldShowSkeleton ? 'visible' : 'hidden'}
        >
          <Box
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="xl"
            bg="whiteAlpha.50"
            p={5}
            minW={0}
          >
            <Skeleton h="10px" w="80px" mb={4} />
            <Skeleton h="26px" w="110px" mb={2} />
            <Skeleton h="13px" w="70px" />
          </Box>

          <Box
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="xl"
            bg="whiteAlpha.50"
            p={5}
            minW={0}
          >
            <Skeleton h="10px" w="100px" mb={4} />
            <Skeleton h="26px" w="140px" mb={2} />
            <Skeleton h="13px" w="90px" />
          </Box>

          <Box
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="xl"
            bg="whiteAlpha.50"
            p={4}
            minH={{ md: '240px' }}
            minW={0}
          >
            <Skeleton h="20px" w="130px" mb={4} />
            <Skeleton h="11px" w="100px" mb={3} />
            <Flex gap={2} flexWrap="wrap">
              <Skeleton h="30px" w="88px" borderRadius="full" />
              <Skeleton h="30px" w="72px" borderRadius="full" />
              <Skeleton h="30px" w="96px" borderRadius="full" />
            </Flex>
          </Box>

          <Box
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="xl"
            bg="whiteAlpha.50"
            p={4}
            minH={{ md: '240px' }}
            minW={0}
          >
            <Skeleton h="20px" w="70px" mb={4} />
            <Flex direction="column" gap={1}>
              <Skeleton h="36px" w="100%" borderRadius="md" />
              <Skeleton h="36px" w="100%" borderRadius="md" />
              <Skeleton h="36px" w="80%" borderRadius="md" />
            </Flex>
          </Box>
        </Grid>
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={4}
          alignItems="start"
        >
          <AirDates show={currentShowInfo} />
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
      )}
    </Box>
  );
};
