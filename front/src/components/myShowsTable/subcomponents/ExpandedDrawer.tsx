import { Row } from 'react-table';
import {
  Badge,
  Box,
  Flex,
  Image,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tag,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { fallbackImagePath, imagePath154 } from 'constants/strings';
import VideoTrailerLink from './VideoTrailerLink';

interface Props {
  isExpanded: boolean;
  row: Row<BasicShowInfo>;
}

const ExpandedDrawer = ({ isExpanded, row }: Props) => {
  const [isMobile] = useMediaQuery(['(max-width: 768px)']);
  const {
    genreNames,
    lastEpisodeForDisplay,
    nextEpisodeForDisplay,
    numEpisodes,
    numSeasons,
    statusWithColor,
    posterPath,
    videoTrailerKey,
  } = row.original;
  const cellBackgroundColor = useColorModeValue('#f7f5f5', '#252E41');

  const getNextEpisodeFormatted = () =>
    nextEpisodeForDisplay?.name ? (
      <span>
        S{nextEpisodeForDisplay.seasonNumber} E{nextEpisodeForDisplay.episodeNumber} -{' '}
        {nextEpisodeForDisplay?.name}
      </span>
    ) : (
      <span>
        S{nextEpisodeForDisplay.seasonNumber} E{nextEpisodeForDisplay.episodeNumber}
      </span>
    );

  const getLastEpisodeFormatted = () =>
    lastEpisodeForDisplay?.name ? (
      <span>
        S{lastEpisodeForDisplay.seasonNumber} E{lastEpisodeForDisplay.episodeNumber} -{' '}
        {lastEpisodeForDisplay?.name}
      </span>
    ) : (
      <span>
        S{lastEpisodeForDisplay.seasonNumber} E{lastEpisodeForDisplay.episodeNumber}
      </span>
    );

  return isExpanded ? (
    isMobile ? (
      <Tr>
        <Td bg={cellBackgroundColor} colSpan={row.allCells.length} p="0 32px 26px 40px">
          <Flex direction="column">
            {genreNames && (
              <Box mb="6px">
                {genreNames?.map(genre => (
                  <Tag key={genre} mb="5px" mr="5px" size="sm">
                    {genre}
                  </Tag>
                ))}
              </Box>
            )}
            {videoTrailerKey && <VideoTrailerLink videoTrailerKey={videoTrailerKey} isMobile />}

            {nextEpisodeForDisplay?.airDate ? (
              <Flex direction="column" mt="20px">
                <Text fontWeight="500">Next Airing</Text>
                <Text fontSize="lg" fontWeight="600" mb="5px">
                  {getNextEpisodeFormatted()}
                </Text>
                <Badge
                  colorScheme={statusWithColor.color}
                  fontSize="11px"
                  fontWeight="700"
                  mr="auto"
                  px="5px"
                >
                  {nextEpisodeForDisplay.timeFromNow}
                </Badge>
              </Flex>
            ) : lastEpisodeForDisplay?.airDate ? (
              <Flex direction="column" mt="20px">
                <Text fontWeight="500">Most Recent</Text>
                <Text fontSize="lg" fontWeight="600" mb="5px">
                  {getLastEpisodeFormatted()}
                </Text>
                <Badge colorScheme={statusWithColor.color} fontSize="11px" mr="auto" px="5px">
                  Aired {lastEpisodeForDisplay.timeFromNow}
                </Badge>
              </Flex>
            ) : null}
          </Flex>
        </Td>
      </Tr>
    ) : (
      <Tr>
        <Td bg={cellBackgroundColor} colSpan={row.allCells.length} pt="0">
          <Flex h="180px" ml="10px">
            <Image
              borderRadius="6px"
              fallbackSrc={fallbackImagePath}
              fill="cover"
              src={imagePath154 + posterPath}
            />

            <Flex
              direction="column"
              justify="space-between"
              minW={{ md: '180px', lg: '210px', xl: '260px' }}
              ml="22px"
            >
              <Flex direction="column">
                {genreNames && (
                  <Box maxW="200px" mb="6px">
                    {genreNames?.map(genre => (
                      <Tag key={genre} mb="5px" mr="5px" size="md">
                        {genre}
                      </Tag>
                    ))}
                  </Box>
                )}
                {videoTrailerKey && <VideoTrailerLink videoTrailerKey={videoTrailerKey} />}
              </Flex>
              <StatGroup w="170px">
                <Stat>
                  <StatLabel>Seasons</StatLabel>
                  <StatNumber>{numSeasons}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Episodes</StatLabel>
                  <StatNumber>{numEpisodes}</StatNumber>
                </Stat>
              </StatGroup>
            </Flex>

            {nextEpisodeForDisplay?.airDate ? (
              <Flex alignSelf="center" direction="column">
                <Text fontWeight="500">Next Airing</Text>
                <Text fontSize="md" fontWeight="600" mb="5px">
                  {getNextEpisodeFormatted()}
                </Text>
                <Badge
                  colorScheme={statusWithColor.color}
                  fontSize="11px"
                  fontWeight="700"
                  mr="auto"
                  px="5px"
                >
                  {nextEpisodeForDisplay.timeFromNow}
                </Badge>
              </Flex>
            ) : lastEpisodeForDisplay?.airDate ? (
              <Flex alignSelf="center" direction="column">
                <Text fontWeight="500">Most Recent </Text>
                <Text fontSize="md" fontWeight="600" mb="5px">
                  {getLastEpisodeFormatted()}
                </Text>
                <Badge colorScheme={statusWithColor.color} fontSize="11px" mr="auto" px="5px">
                  Aired {lastEpisodeForDisplay.timeFromNow}
                </Badge>
              </Flex>
            ) : null}
          </Flex>
        </Td>
      </Tr>
    )
  ) : null;
};

export default ExpandedDrawer;
