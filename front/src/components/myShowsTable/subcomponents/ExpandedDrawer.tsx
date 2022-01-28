import React from 'react';
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
  useMediaQuery,
} from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { fallbackImagePath, imagePath154 } from 'constants/strings';
import VideoTrailerLink from './VideoTrailerLink';

interface Props {
  darkMode: boolean;
  isExpanded: boolean;
  row: Row<BasicShowInfo>;
}

const ExpandedDrawer = ({ darkMode, isExpanded, row }: Props) => {
  const [isLargerThan768] = useMediaQuery(['(min-width: 768px)']);
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
    isLargerThan768 ? (
      <Tr>
        <Td backgroundColor={darkMode ? '#252E41' : '#f7f5f5'} colSpan={row.allCells.length} pt="0">
          <Flex height="180px">
            <Image
              borderRadius="6px"
              fallbackSrc={fallbackImagePath}
              fill="cover"
              src={imagePath154 + posterPath}
            />

            <Flex
              direction="column"
              justify="space-between"
              minW={{ md: '180px', lg: '220px', xl: '270px' }}
              ml="22px"
            >
              <Flex direction="column">
                {videoTrailerKey && <VideoTrailerLink videoTrailerKey={videoTrailerKey} />}
                {genreNames && (
                  <Box maxW="200px">
                    {genreNames?.map(genre => (
                      <Tag key={genre} mb="5px" mr="5px" size="md">
                        {genre}
                      </Tag>
                    ))}
                  </Box>
                )}
              </Flex>
              <StatGroup width="170px">
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
    ) : (
      <Tr>
        <Td
          backgroundColor={darkMode ? '#252E41' : '#f7f5f5'}
          colSpan={row.allCells.length}
          p="0 32px 26px 40px"
        >
          <Flex direction="column">
            {videoTrailerKey && <VideoTrailerLink videoTrailerKey={videoTrailerKey} />}

            {genreNames && (
              <Box>
                {genreNames?.map(genre => (
                  <Tag key={genre} mb="5px" mr="5px" size="sm">
                    {genre}
                  </Tag>
                ))}
              </Box>
            )}

            <StatGroup mt="20px" width="170px">
              <Stat>
                <StatLabel fontSize="xs">Seasons</StatLabel>
                <StatNumber fontSize="lg">{numSeasons}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="xs">Episodes</StatLabel>
                <StatNumber fontSize="lg">{numEpisodes}</StatNumber>
              </Stat>
            </StatGroup>

            {nextEpisodeForDisplay?.airDate ? (
              <Flex direction="column" mt="20px">
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
              <Flex direction="column" mt="24px">
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
    )
  ) : null;
};

export default ExpandedDrawer;
