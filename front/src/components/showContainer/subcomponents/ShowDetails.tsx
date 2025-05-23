import {
  Box,
  chakra,
  Flex,
  Heading,
  Icon,
  Skeleton,
  Tag,
  Text,
} from '@chakra-ui/react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';
import { TbLanguage } from 'react-icons/tb';

import FollowButton from '~/components/common/FollowButton';
import { useIsMobile } from '~/hooks/useIsMobile';
import { BasicShowInfo } from '~/types/external';
import { abbreviateNumber } from '~/utils/formatting';

import VideoTrailerButton from './VideoTrailerButton';

type Props = {
  showInfoForDisplay: BasicShowInfo | null;
  isLoading: boolean;
};

const ShowDetails = ({ showInfoForDisplay, isLoading }: Props) => {
  const isMobile = useIsMobile();
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
  } = showInfoForDisplay || {};

  return (
    <Box minW="100%">
      <Skeleton loading={isLoading}>
        <Heading as="h3" fontSize="3xl" mb="7px">
          {name}{' '}
          {yearsActive && (
            <chakra.span fontSize="2xl" fontWeight="600">
              ({yearsActive})
            </chakra.span>
          )}
        </Heading>
      </Skeleton>

      {isLoading || (!isLoading && voteAverage) ? (
        <Skeleton loading={isLoading} w="85px">
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
              <Flex ml="2px">
                <Text fontSize="xs" fontWeight="600">
                  {voteCount && abbreviateNumber(voteCount)}{' '}
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
        </Skeleton>
      ) : null}

      {isLoading || (!isLoading && genreNames?.length) ? (
        <Box mb="18px">
          {/* only set w and h when loading is true */}
          <Skeleton
            loading={isLoading}
            w={isLoading ? '85px' : 'unset'}
            h={isLoading ? '30px' : 'unset'}
          >
            {genreNames?.map(genre => (
              <Tag.Root colorPalette="gray" key={genre} mr="5px" size="lg">
                {genre}
              </Tag.Root>
            ))}
          </Skeleton>
        </Box>
      ) : null}

      {isMobile && id && (
        <FollowButton mb="14px" showId={id} size="md" width="100%" />
      )}

      <VideoTrailerButton videoId={videoTrailerKey} isLoading={isLoading} />

      <Flex direction="column" gap="4px" mt="18px">
        {isLoading ||
          (!isLoading && network && (
            <Skeleton loading={isLoading} w="85px">
              <Flex align="center" gap="6px">
                <Icon
                  alignSelf="center"
                  as={HiOutlineVideoCamera}
                  boxSize="18px"
                />
                <Text fontSize="15px">{network}</Text>
              </Flex>
            </Skeleton>
          ))}
        {isLoading ||
          (!isLoading && episodeRunTime && (
            <Skeleton loading={isLoading} w="85px">
              <Flex align="center" gap="6px">
                <Icon alignSelf="center" as={IoIosTimer} boxSize="18px" />
                <Text fontSize="15px">{episodeRunTime} mins</Text>
              </Flex>
            </Skeleton>
          ))}
        {isLoading ||
          (!isLoading && language && (
            <Skeleton loading={isLoading} w="85px">
              <Flex align="center" gap="6px">
                <Icon alignSelf="center" as={TbLanguage} boxSize="18px" />
                <Text fontSize="15px">{language}</Text>
              </Flex>
            </Skeleton>
          ))}
      </Flex>

      {isLoading ||
        (!isLoading && overview && (
          <Flex direction="column" mt="18px">
            <Skeleton loading={isLoading}>
              <Heading as="h4" fontSize={isMobile ? 'xl' : '20px'} mb="4px">
                Overview
              </Heading>
            </Skeleton>
            <Skeleton loading={isLoading}>
              <Text>{overview}</Text>
            </Skeleton>
          </Flex>
        ))}
    </Box>
  );
};

export default ShowDetails;
