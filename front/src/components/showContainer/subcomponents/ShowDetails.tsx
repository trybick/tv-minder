import { Box, chakra, Flex, Heading, Icon, Tag, Text } from '@chakra-ui/react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
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

      <VideoTrailerButton isMobile={isMobile} videoId={videoTrailerKey} />

      {overview && <Text mb="12px">{overview}</Text>}

      {createdBy && (
        <Text fontSize="15px">
          <chakra.span fontWeight="600">Created by:</chakra.span> {createdBy}
        </Text>
      )}
      {language && (
        <Text fontSize="15px">
          <chakra.span fontWeight="600">Language:</chakra.span> {language}
        </Text>
      )}
      {episodeRunTime && (
        <Text fontSize="15px">
          <chakra.span fontWeight="600">Run time:</chakra.span> {episodeRunTime} mins
        </Text>
      )}
    </Box>
  );
};

export default ShowDetails;
