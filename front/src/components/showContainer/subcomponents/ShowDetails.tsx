import { Box, chakra, Flex, Heading, Icon, Tag, Text } from '@chakra-ui/react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
import { IoIosTimer } from 'react-icons/io';
import { TbLanguage } from 'react-icons/tb';
import { TfiWrite } from 'react-icons/tfi';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { BasicShowInfo } from 'types/external';
import { abbreviateNumber } from 'utils/formatting';
import VideoTrailerButton from './VideoTrailerButton';
import FollowButton from 'components/common/FollowButton';

type Props = {
  isMobile: boolean;
  showInfoForDisplay: BasicShowInfo;
};

const ShowDetails = ({ isMobile, showInfoForDisplay }: Props) => {
  const {
    createdBy,
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
      <Heading as="h3" fontSize="3xl" mb="8px">
        {name}{' '}
        {yearsActive && (
          <chakra.span fontSize="xl" fontWeight="600">
            ({yearsActive})
          </chakra.span>
        )}
      </Heading>

      {voteAverage ? (
        <Flex mb="16px">
          <Icon alignSelf="center" as={FaStar} boxSize="27px" color="yellow.400" />
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
              <Icon as={BsFillPersonFill} boxSize="12px" m="auto 0" verticalAlign="middle" />
            </Flex>
          </Flex>
        </Flex>
      ) : null}

      <VideoTrailerButton isMobile={isMobile} videoId={videoTrailerKey} />

      {genreNames && (
        <Box mb="16px">
          {genreNames?.map(genre => (
            <Tag key={genre} mr="5px" size="md">
              {genre}
            </Tag>
          ))}
        </Box>
      )}

      {isMobile && <FollowButton mb="14px" showId={id} size="md" width="100%" />}

      <Flex direction="column" gap="3px">
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
        {createdBy && (
          <Flex align="center" gap="6px">
            <Icon alignSelf="center" as={TfiWrite} boxSize="18px" />
            <Text fontSize="15px">{createdBy}</Text>
          </Flex>
        )}
      </Flex>

      {overview && <Text mt="12px">{overview}</Text>}
    </Box>
  );
};

export default ShowDetails;
