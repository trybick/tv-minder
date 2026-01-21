import {
  Box,
  Button,
  chakra,
  Collapsible,
  Flex,
  Grid,
  Heading,
  Icon,
  Stat,
  Status,
  Tag,
  Text,
} from '@chakra-ui/react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
import {
  HiChevronDown,
  HiOutlineCalendar,
  HiOutlineVideoCamera,
} from 'react-icons/hi';
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
import { dayjs } from '~/utils/dayjs';
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
    lastEpisodeAirDate,
    name,
    network,
    nextEpisodeAirDate,
    overview,
    status,
    videoTrailerKey,
    voteAverage,
    voteCount,
    yearsActive,
  } = currentShowInfo || {};

  const getStatusDisplay = () => {
    if (!status) return null;
    if (status.isEnded) {
      return { label: 'Ended', color: 'gray' as const };
    }
    if (status.isActiveSeason) {
      return { label: 'Airing Now', color: 'green' as const };
    }
    if (status.isPremieringSoon) {
      return { label: 'Premiering Soon', color: 'blue' as const };
    }
    if (status.isInProduction) {
      return { label: 'In Production', color: 'orange' as const };
    }
    return null;
  };

  const statusDisplay = getStatusDisplay();

  const hasMetadata = network || episodeRunTime || language || statusDisplay;
  const hasAirDates = lastEpisodeAirDate || nextEpisodeAirDate;

  const formatAirDate = (date: string) => {
    const dateObj = dayjs(date);
    const isCurrentYear = dateObj.isSame(dayjs(), 'year');
    return dateObj.format(isCurrentYear ? 'MMM D' : 'MMM D, YYYY');
  };

  return (
    <Box w="100%">
      {/* Title & Status */}
      <Flex
        justify="space-between"
        align="flex-start"
        wrap="nowrap"
        gap={4}
        mb={3}
      >
        <DelayedSkeleton
          isLoading={isLoading}
          w={isLoading ? '280px' : 'auto'}
          h={isLoading ? '36px' : 'auto'}
        >
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }}>
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

        <VideoTrailerButton videoId={videoTrailerKey} />
      </Flex>

      {/* Rating & Status */}
      <Flex align="center" gap={4} mb={5} flexWrap="wrap">
        {(isLoading || (!isLoading && voteAverage)) && (
          <DelayedSkeleton isLoading={isLoading} w="120px">
            <Flex align="center" gap={1.5}>
              <Icon as={FaStar} boxSize="16px" color="yellow.400" />
              <Text fontSize="md" fontWeight="700" color="fg">
                {voteAverage}
              </Text>
              <Flex align="center" gap={1} color="fg.muted" ml={1}>
                <Icon as={BsFillPersonFill} boxSize="14px" />
                <Text fontSize="xs">{abbreviateNumber(voteCount || 1)}</Text>
              </Flex>
            </Flex>
          </DelayedSkeleton>
        )}

        {statusDisplay && !isLoading && (
          <Status.Root
            colorPalette={statusDisplay.color}
            size="md"
            px={3}
            py={1}
            borderRadius="full"
            flexShrink={0}
          >
            <Status.Indicator />
            <Text fontSize="xs" fontWeight="bold" letterSpacing="wider">
              {statusDisplay.label.toUpperCase()}
            </Text>
          </Status.Root>
        )}
      </Flex>

      {/* Actions Row - Genres + Mobile Follow */}
      {isMobile ? (
        <Grid gap={3} mb={6} gridTemplateColumns="1fr 1fr">
          {id && <FollowButton showId={id} size="lg" />}
          {isLoading || (!isLoading && genreNames?.length) ? (
            <DelayedSkeleton
              isLoading={isLoading}
              w={isLoading ? '100%' : 'auto'}
            >
              <Flex gap={2} flexWrap="wrap">
                {genreNames?.map(genre => (
                  <Tag.Root
                    key={genre}
                    size="sm"
                    variant="subtle"
                    bg="whiteAlpha.100"
                    borderRadius="full"
                    px={2}
                  >
                    <Tag.Label fontSize="xs" fontWeight="500" color="fg.muted">
                      {genre}
                    </Tag.Label>
                  </Tag.Root>
                ))}
              </Flex>
            </DelayedSkeleton>
          ) : null}
        </Grid>
      ) : (
        <Box mb={6}>
          {isLoading || (!isLoading && genreNames?.length) ? (
            <DelayedSkeleton
              isLoading={isLoading}
              w={isLoading ? '200px' : 'auto'}
            >
              <Flex gap={2} flexWrap="wrap">
                {genreNames?.map(genre => (
                  <Tag.Root
                    key={genre}
                    size="sm"
                    variant="subtle"
                    bg="whiteAlpha.100"
                    borderRadius="full"
                    px={2}
                  >
                    <Tag.Label fontSize="xs" fontWeight="500" color="fg.muted">
                      {genre}
                    </Tag.Label>
                  </Tag.Root>
                ))}
              </Flex>
            </DelayedSkeleton>
          ) : null}
        </Box>
      )}

      {/* Overview */}
      {(isLoading || overview) && (
        <Box mb={8}>
          {isLoading ? (
            <DelayedSkeletonText isLoading={isLoading} noOfLines={6} w="100%" />
          ) : overview && overview.length > 300 ? (
            <Collapsible.Root collapsedHeight="100px">
              <Collapsible.Content
                overflow="hidden"
                _closed={{
                  maskImage:
                    'linear-gradient(to bottom, black 60px, transparent 100%)',
                }}
              >
                <Text
                  color="fg"
                  fontSize="md"
                  lineHeight="1.7"
                  letterSpacing="0.01em"
                >
                  {overview}
                </Text>
              </Collapsible.Content>
              <Collapsible.Trigger asChild>
                <Button
                  variant="ghost"
                  size="xs"
                  color="fg.muted"
                  mt={2}
                  px={0}
                  _hover={{ bg: 'transparent', color: 'fg' }}
                >
                  <Collapsible.Context>
                    {api => (api.open ? 'Show Less' : 'Show More')}
                  </Collapsible.Context>
                  <Collapsible.Indicator
                    transition="transform 0.2s"
                    _open={{ transform: 'rotate(180deg)' }}
                  >
                    <HiChevronDown />
                  </Collapsible.Indicator>
                </Button>
              </Collapsible.Trigger>
            </Collapsible.Root>
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

      {/* Air Dates Section */}
      {!isLoading && hasAirDates && (
        <Grid gap={4} templateColumns={{ base: '1fr', sm: '1fr 1fr' }} mb={8}>
          {nextEpisodeAirDate && (
            <Stat.Root
              p={4}
              bg="whiteAlpha.100"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
              boxShadow="sm"
            >
              <Flex align="center" gap={2} mb={1}>
                <Icon as={HiOutlineCalendar} color="cyan.600" boxSize="16px" />
                <Stat.Label color="fg.muted" fontWeight="semibold">
                  Next Episode
                </Stat.Label>
              </Flex>
              <Stat.ValueText color="fg.muted" fontSize="xl" fontWeight="bold">
                {formatAirDate(nextEpisodeAirDate)}
              </Stat.ValueText>
              <Stat.HelpText color="cyan.600" fontWeight="semibold">
                {dayjs(nextEpisodeAirDate).fromNow()}
              </Stat.HelpText>
            </Stat.Root>
          )}
          {lastEpisodeAirDate && (
            <Stat.Root
              p={4}
              bg="whiteAlpha.50"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="whiteAlpha.100"
            >
              <Stat.Label color="fg.muted" fontWeight="medium">
                Last Aired
              </Stat.Label>
              <Stat.ValueText
                color="fg.muted"
                fontSize="xl"
                fontWeight="bold"
                opacity={0.8}
              >
                {formatAirDate(lastEpisodeAirDate)}
              </Stat.ValueText>
              <Stat.HelpText color="fg.muted">
                {dayjs(lastEpisodeAirDate).fromNow()}
              </Stat.HelpText>
            </Stat.Root>
          )}
        </Grid>
      )}

      {/* Metadata Footer */}
      {isLoading ? (
        <DelayedSkeleton isLoading={isLoading} w="180px" h="24px" />
      ) : (
        hasMetadata && (
          <Flex
            gap={6}
            flexWrap="wrap"
            color="fg.muted"
            pt={4}
            borderTop="1px solid"
            borderColor="whiteAlpha.100"
          >
            {network && (
              <Flex align="center" gap={2}>
                <Icon as={HiOutlineVideoCamera} boxSize="18px" opacity={0.7} />
                <Text fontSize="sm" fontWeight="500">
                  {network}
                </Text>
              </Flex>
            )}
            {episodeRunTime && (
              <Flex align="center" gap={2}>
                <Icon as={IoIosTimer} boxSize="18px" opacity={0.7} />
                <Text fontSize="sm" fontWeight="500">
                  {episodeRunTime} min
                </Text>
              </Flex>
            )}
            {language && (
              <Flex align="center" gap={2}>
                <Icon as={TbLanguage} boxSize="18px" opacity={0.7} />
                <Text fontSize="sm" fontWeight="500">
                  {language}
                </Text>
              </Flex>
            )}
          </Flex>
        )
      )}
    </Box>
  );
};
