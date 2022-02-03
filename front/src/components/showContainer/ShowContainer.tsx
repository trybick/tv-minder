import {
  Box,
  chakra,
  Flex,
  Heading,
  Icon,
  Image,
  Tag,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
import { BasicShowInfo } from 'types/external';
import { abbreviateNumber } from 'utils/formatting';
import { fallbackImagePath, imagePath342 } from 'constants/strings';
import VideoTrailerLink from '../myShowsTable/subcomponents/VideoTrailerLink';
import FollowButton from './subcomponents/FollowButton';

interface Props {
  showInfoForDisplay: BasicShowInfo;
}

const ShowContainer = ({ showInfoForDisplay }: Props) => {
  const [isMobile] = useMediaQuery(['(max-width: 768px)']);
  const {
    createdBy,
    episodeRunTime,
    genreNames,
    id,
    language,
    name,
    overview,
    posterPath,
    seasonsAndEpisodes,
    videoTrailerKey,
    voteAverage,
    voteCount,
    yearsActive,
  } = showInfoForDisplay || {};
  console.log('seasonsAndEpisodes:', seasonsAndEpisodes);

  return (
    <Flex gap="20px" m="20px auto 30px" maxW="800px" px={{ base: '20px', md: '30px' }}>
      {!isMobile && (
        <Flex direction="column" gap="12px">
          <Image
            borderRadius="8px"
            fallbackSrc={fallbackImagePath}
            src={imagePath342 + posterPath}
          />
          <FollowButton showId={id} />
        </Flex>
      )}

      <Box w="100%">
        <Heading as="h3" fontSize="2xl" mb="8px">
          {name}{' '}
          <chakra.span fontSize="xl" fontWeight="600">
            ({yearsActive})
          </chakra.span>
        </Heading>

        {voteAverage && (
          <Flex mb="14px">
            <Icon alignSelf="center" as={FaStar} boxSize="27px" color="yellow.400" />
            <Flex direction="column" ml="4px">
              <Text fontSize="16px">
                <chakra.span fontSize="17px" fontWeight="700">
                  {voteAverage}
                </chakra.span>{' '}
                <chakra.span fontSize="sm">/ 10</chakra.span>
              </Text>
              <Flex>
                <Text fontSize="xs" fontWeight="600">
                  {abbreviateNumber(voteCount)}{' '}
                </Text>
                <Icon as={BsFillPersonFill} boxSize="12px" m="auto 0" verticalAlign="middle" />
              </Flex>
            </Flex>
          </Flex>
        )}

        <Flex gap="20px" mb={isMobile ? '16px' : '12px'}>
          {genreNames && (
            <Box>
              {genreNames?.map(genre => (
                <Tag key={genre} mr="5px" size="md">
                  {genre}
                </Tag>
              ))}
            </Box>
          )}
          <VideoTrailerLink isMobile={isMobile} videoTrailerKey={videoTrailerKey} />
        </Flex>

        {isMobile && (
          <FollowButton showId={id} styles={{ mb: '16px', size: 'sm', width: '100%' }} />
        )}

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
    </Flex>
  );
};

export default ShowContainer;
