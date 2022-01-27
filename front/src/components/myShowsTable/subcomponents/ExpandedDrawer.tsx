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
    <Tr>
      <Td backgroundColor={darkMode ? '#252E41' : '#f7f5f5'} colSpan={row.allCells.length} pt="0">
        <Flex height="180px">
          {/* Image */}
          <Image
            borderRadius="6px"
            fallbackSrc={fallbackImagePath}
            fill="cover"
            src={imagePath154 + posterPath}
          />

          {/* Details */}
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

          {/* Next Airing / Last Aired */}
          {nextEpisodeForDisplay?.airDate ? (
            <Flex alignSelf="center" direction="column">
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
          ) : (
            <Flex alignSelf="center" direction="column">
              <Text fontSize="md" fontWeight="600" mb="5px">
                {getLastEpisodeFormatted()}
              </Text>
              <Badge colorScheme={statusWithColor.color} fontSize="11px" mr="auto" px="5px">
                Last aired {lastEpisodeForDisplay.timeFromNow}
              </Badge>
            </Flex>
          )}
        </Flex>
      </Td>
    </Tr>
  ) : null;
};

export default ExpandedDrawer;
