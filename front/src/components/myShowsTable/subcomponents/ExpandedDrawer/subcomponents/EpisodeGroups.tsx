import { Link as RouterLink } from 'react-router-dom';
import { Badge, Button, chakra, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { NA } from 'constants/strings';
import { BsArrowRightSquare } from 'react-icons/bs';
import { EpisodeForDisplay } from 'types/external';
import { ROUTES } from 'constants/routes';

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
        <Text fontSize="md" fontWeight="600" maxW="300px" mb="5px" noOfLines={1}>
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
      <Flex align="center" direction="column">
        {getEpisodeText(lastEpisode)}
        <Badge
          colorScheme={badgeColorScheme}
          fontSize="12px"
          fontWeight="600"
          justifySelf="center"
          px="8px"
        >
          {lastEpisode?.timeFromNow}
        </Badge>
      </Flex>

      {nextEpisode && (
        <Flex align="center" direction="column">
          {getEpisodeText(nextEpisode)}
          <Badge
            colorScheme={badgeColorScheme}
            fontSize="12px"
            fontWeight="600"
            justifySelf="center"
            px="8px"
          >
            {nextEpisode?.timeFromNow}
          </Badge>
        </Flex>
      )}

      <ChakraRouterLink alignSelf="center" justifySelf="center" to={`${ROUTES.SHOW}/${showId}`}>
        <Button colorScheme="cyan" rightIcon={<BsArrowRightSquare />} size="sm" variant="outline">
          More Episodes
        </Button>
      </ChakraRouterLink>
    </>
  );
};

export default EpisodeGroups;
