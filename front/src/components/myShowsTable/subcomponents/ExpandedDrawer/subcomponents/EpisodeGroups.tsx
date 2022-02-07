import { Link as RouterLink } from 'react-router-dom';
import { Badge, Button, chakra, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { NA } from 'constants/strings';
import { BsArrowRightSquare } from 'react-icons/bs';
import { EpisodeForDisplay } from 'types/external';

const ChakraRouterLink = chakra(RouterLink);

interface Props {
  lastEpisode: EpisodeForDisplay;
  nextEpisode: EpisodeForDisplay;
  showId: number;
}

const EpisodeGroups = ({ lastEpisode, nextEpisode, showId }: Props) => {
  const badgeColorScheme = useColorModeValue('black', 'gray');

  const getEpisodeText = (episode: EpisodeForDisplay) => {
    if (!episode?.seasonNumber) {
      return <span>{NA}</span>;
    }
    return episode?.name ? (
      <Flex align="flex-start" direction="column">
        <Text fontSize="md" fontWeight="600" mb="5px">
          S{episode.seasonNumber} E{episode.episodeNumber} - {episode?.name}
        </Text>
      </Flex>
    ) : (
      <Flex align="flex-start" direction="column">
        <Text fontSize="md" fontWeight="600" mb="5px">
          S{episode.seasonNumber} E{episode.episodeNumber}
        </Text>
      </Flex>
    );
  };

  return (
    <>
      <Flex align="center" direction="column" gap="4px">
        <Badge colorScheme={badgeColorScheme} fontSize="12px" fontWeight="600" justifySelf="center">
          Last Episode {lastEpisode?.timeFromNow}
        </Badge>
        {getEpisodeText(lastEpisode)}
      </Flex>

      <Flex align="center" direction="column" gap="4px">
        <Badge colorScheme={badgeColorScheme} fontSize="12px" fontWeight="600" justifySelf="center">
          Next Episode {nextEpisode?.timeFromNow}
        </Badge>
        {getEpisodeText(nextEpisode)}
      </Flex>

      <ChakraRouterLink alignSelf="center" justifySelf="center" to={`/show/${showId}`}>
        <Button colorScheme="cyan" rightIcon={<BsArrowRightSquare />} size="md" variant="outline">
          View More
        </Button>
      </ChakraRouterLink>
    </>
  );
};

export default EpisodeGroups;
