import { Box, chakra, Flex, Heading, Icon, Tag, Text } from '@chakra-ui/react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';
import { TbLanguage } from 'react-icons/tb';

import FollowButton from '~/components/common/FollowButton';
import { BasicShowInfo } from '~/types/external';
import { abbreviateNumber } from '~/utils/formatting';

import VideoTrailerButton from './VideoTrailerButton';

type Props = {
  isMobile: boolean;
  showInfoForDisplay: BasicShowInfo;
};

const ShowDetails = ({ isMobile, showInfoForDisplay }: Props) => {
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
    <Box w="100%">
      <Heading as="h3" fontSize="3xl" mb="7px">
        {name}{' '}
        {yearsActive && (
          <chakra.span fontSize="2xl" fontWeight="600">
            ({yearsActive})
          </chakra.span>
        )}
      </Heading>

      {voteAverage ? (
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
                {abbreviateNumber(voteCount)}{' '}
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
      ) : null}

      {genreNames && (
        <Box mb="18px">
          {genreNames?.map(genre => (
            <Tag.Root colorPalette="gray" key={genre} mr="5px" size="lg">
              {genre}
            </Tag.Root>
          ))}
        </Box>
      )}

      {isMobile && (
        <FollowButton mb="14px" showId={id} size="md" width="100%" />
      )}

      <VideoTrailerButton isMobile={isMobile} videoId={videoTrailerKey} />

      <Flex direction="column" gap="4px" mt="18px">
        {network && (
          <Flex align="center" gap="6px">
            <Icon alignSelf="center" as={HiOutlineVideoCamera} boxSize="18px" />
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

      {overview && (
        <Flex direction="column" mt="18px">
          <Heading as="h4" fontSize={isMobile ? 'xl' : '20px'} mb="4px">
            Overview
          </Heading>
          <Text>{overview}</Text>
        </Flex>
      )}
    </Box>
  );
};

export default ShowDetails;
