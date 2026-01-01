import { Box, chakra, Flex, Heading, Icon, Tag, Text } from '@chakra-ui/react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';
import { TbLanguage } from 'react-icons/tb';

import DelayedSkeleton from '~/components/DelayedSkeleton';
import DelayedSkeletonText from '~/components/DelayedSkeletonText';
import FollowButton from '~/components/FollowButton';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
} from '~/store/tv/selectors';
import { abbreviateNumber } from '~/utils/formatting';

import VideoTrailerButton from './VideoTrailerButton';

const ShowDetails = () => {
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

  return (
    <Box w="100%">
      <DelayedSkeleton isLoading={isLoading}>
        <Heading as="h3" fontSize="3xl" mb="7px" color="fg.muted">
          {name}{' '}
          {yearsActive && (
            <chakra.span fontSize="2xl" fontWeight="600">
              ({yearsActive})
            </chakra.span>
          )}
        </Heading>
      </DelayedSkeleton>

      {(isLoading || (!isLoading && voteAverage)) && (
        <DelayedSkeleton isLoading={isLoading} w="145px">
          <Flex mb="18px">
            <Icon
              alignSelf="center"
              as={FaStar}
              boxSize="27px"
              color="yellow.400"
            />
            <Flex direction="column" ml="4px">
              <Text fontSize="16px">
                <chakra.span fontSize="17px" fontWeight="700">
                  {voteAverage}
                </chakra.span>{' '}
                <chakra.span fontSize="sm" verticalAlign="text-bottom">
                  / 10
                </chakra.span>
              </Text>
              <Flex ml="2px" gap="2px">
                <Text fontSize="xs" fontWeight="600">
                  {abbreviateNumber(voteCount || 1)}{' '}
                </Text>
                <Icon
                  as={BsFillPersonFill}
                  boxSize="12px"
                  m="auto 0"
                  verticalAlign="middle"
                />
              </Flex>
            </Flex>
          </Flex>
        </DelayedSkeleton>
      )}

      {isLoading || (!isLoading && genreNames?.length) ? (
        <Box mb="18px">
          <DelayedSkeleton
            isLoading={isLoading}
            w={isLoading ? '145px' : 'unset'}
            h={isLoading ? '28px' : 'unset'}
          >
            {genreNames?.map(genre => (
              <Tag.Root
                colorPalette="gray"
                variant="outline"
                key={genre}
                mr="5px"
                size="lg"
              >
                <Tag.Label>{genre}</Tag.Label>
              </Tag.Root>
            ))}
          </DelayedSkeleton>
        </Box>
      ) : null}

      {isMobile && id && (
        <FollowButton mb="14px" showId={id} size="lg" width="100%" />
      )}

      <VideoTrailerButton videoId={videoTrailerKey} />

      {overview && (
        <Flex direction="column" mt="18px">
          {isLoading ? (
            <DelayedSkeletonText isLoading={isLoading} noOfLines={9} w="100%" />
          ) : (
            <Text>{overview}</Text>
          )}
        </Flex>
      )}

      {isLoading ? (
        <DelayedSkeleton isLoading={isLoading} w="145px" h="40px" />
      ) : (
        <Flex direction="column" gap="4px" mt="18px">
          {network && (
            <Flex align="center" gap="6px">
              <Icon
                alignSelf="center"
                as={HiOutlineVideoCamera}
                boxSize="18px"
              />
              <Text fontSize="15px">{network}</Text>
            </Flex>
          )}
          {episodeRunTime && (
            <Flex align="center" gap="6px">
              <Icon alignSelf="center" as={IoIosTimer} boxSize="18px" />
              <Text fontSize="15px">{episodeRunTime} mins</Text>
            </Flex>
          )}
          {language && (
            <Flex align="center" gap="6px">
              <Icon alignSelf="center" as={TbLanguage} boxSize="18px" />
              <Text fontSize="15px">{language}</Text>
            </Flex>
          )}
        </Flex>
      )}
    </Box>
  );
};

export default ShowDetails;
