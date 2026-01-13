import {
  Box,
  chakra,
  Flex,
  Grid,
  Heading,
  Icon,
  Tag,
  Text,
} from '@chakra-ui/react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';
import { TbLanguage } from 'react-icons/tb';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { DelayedSkeletonText } from '~/components/DelayedSkeletonText';
import { FollowButton } from '~/components/FollowButton';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
} from '~/store/tv/selectors';
import { abbreviateNumber } from '~/utils/formatting';

import { VideoTrailerButton } from './VideoTrailerButton';

export const ShowDetails = () => {
  const isMobile = useIsMobile();
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const {
    episodeRunTime,
    genreNames,
    id,
    language,
    name,
    network,
    overview,
    videoTrailerKey,
    voteAverage,
    voteCount,
    yearsActive,
  } = currentShowInfo || {};

  const hasMetadata = network || episodeRunTime || language;

  return (
    <Box w="100%">
      {/* Title & Year */}
      <DelayedSkeleton
        isLoading={isLoading}
        w={isLoading ? '280px' : undefined}
        h={isLoading ? '36px' : undefined}
      >
        <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} mb={3}>
          {name}
          {yearsActive && (
            <chakra.span
              color="fg.muted"
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="400"
              ml={2}
            >
              ({yearsActive})
            </chakra.span>
          )}
        </Heading>
      </DelayedSkeleton>

      {/* Rating */}
      {(isLoading || (!isLoading && voteAverage)) && (
        <DelayedSkeleton isLoading={isLoading} w="160px" mb={4}>
          <Flex align="center" gap={2} mb={5}>
            <Flex
              align="center"
              gap={1.5}
              bg="whiteAlpha.100"
              px={2.5}
              py={1}
              borderRadius="md"
            >
              <Icon as={FaStar} boxSize="16px" color="yellow.400" />
              <Text fontSize="md" fontWeight="700" color="fg">
                {voteAverage}
              </Text>
              <Text fontSize="sm" color="fg.muted">
                / 10
              </Text>
            </Flex>
            <Flex align="center" gap={1} color="fg.muted">
              <Icon as={BsFillPersonFill} boxSize="14px" />
              <Text fontSize="sm">{abbreviateNumber(voteCount || 1)}</Text>
            </Flex>
          </Flex>
        </DelayedSkeleton>
      )}

      {/* Genres */}
      {isLoading || (!isLoading && genreNames?.length) ? (
        <Box mb={5}>
          <DelayedSkeleton
            isLoading={isLoading}
            w={isLoading ? '200px' : 'unset'}
            h={isLoading ? '28px' : 'unset'}
          >
            <Flex gap={2} flexWrap="wrap">
              {genreNames?.map(genre => (
                <Tag.Root
                  key={genre}
                  size="md"
                  variant="subtle"
                  bg="whiteAlpha.100"
                  borderRadius="full"
                  px={3}
                >
                  <Tag.Label fontSize="sm" fontWeight="500" color="fg.muted">
                    {genre}
                  </Tag.Label>
                </Tag.Root>
              ))}
            </Flex>
          </DelayedSkeleton>
        </Box>
      ) : null}

      {/* Actions Row - Trailer + Mobile Follow */}
      {isMobile ? (
        <Grid gap={3} mb={5} gridTemplateColumns="1fr 1fr">
          {id && <FollowButton showId={id} size="lg" />}
          <VideoTrailerButton videoId={videoTrailerKey} />
        </Grid>
      ) : (
        <Box mb={5}>
          <VideoTrailerButton videoId={videoTrailerKey} />
        </Box>
      )}

      {/* Overview */}
      {(isLoading || overview) && (
        <Box mb={6}>
          {isLoading ? (
            <DelayedSkeletonText isLoading={isLoading} noOfLines={6} w="100%" />
          ) : (
            <Text
              color="fg"
              fontSize="md"
              lineHeight="1.7"
              letterSpacing="0.01em"
            >
              {overview}
            </Text>
          )}
        </Box>
      )}

      {/* Metadata */}
      {isLoading ? (
        <DelayedSkeleton isLoading={isLoading} w="180px" h="80px" />
      ) : (
        hasMetadata && (
          <Flex gap={4} flexWrap="wrap" color="fg.muted">
            {network && (
              <Flex align="center" gap={2}>
                <Icon as={HiOutlineVideoCamera} boxSize="18px" opacity={0.7} />
                <Text fontSize="sm">{network}</Text>
              </Flex>
            )}
            {episodeRunTime && (
              <Flex align="center" gap={2}>
                <Icon as={IoIosTimer} boxSize="18px" opacity={0.7} />
                <Text fontSize="sm">{episodeRunTime} min</Text>
              </Flex>
            )}
            {language && (
              <Flex align="center" gap={2}>
                <Icon as={TbLanguage} boxSize="18px" opacity={0.7} />
                <Text fontSize="sm">{language}</Text>
              </Flex>
            )}
          </Flex>
        )
      )}
    </Box>
  );
};
