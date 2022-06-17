import { Link as RouterLink } from 'react-router-dom';
import { Badge, Button, chakra, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { BsArrowRightSquare } from 'react-icons/bs';
import { EpisodeForDisplay } from 'types/external';
import { ROUTES } from 'constants/routes';

const ChakraRouterLink = chakra(RouterLink);

type Props = {
  isMobile?: boolean;
  lastEpisode: EpisodeForDisplay;
  nextEpisode: EpisodeForDisplay;
  showId: number;
};

const EpisodeGroups = ({ isMobile, lastEpisode, nextEpisode, showId }: Props) => {
  const badgeColorScheme = useColorModeValue('black', 'gray');
  const noEpisodeData = !lastEpisode && !nextEpisode;

  const getEpisodeText = (episode: EpisodeForDisplay) =>
    episode?.name ? (
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

  return (
    <>
      {lastEpisode && (
        <Flex align="center" direction="column">
          {getEpisodeText(lastEpisode)}
          <Badge
            colorScheme={badgeColorScheme}
            fontSize="11px"
            fontWeight="600"
            justifySelf="center"
            px="8px"
          >
            Aired {lastEpisode?.timeFromNow}
          </Badge>
        </Flex>
      )}

      {nextEpisode && (
        <Flex align="center" direction="column">
          {getEpisodeText(nextEpisode)}
          <Badge
            colorScheme={badgeColorScheme}
            fontSize="11px"
            fontWeight="600"
            justifySelf="center"
            px="8px"
          >
            Airing {nextEpisode?.timeFromNow}
          </Badge>
        </Flex>
      )}

      {noEpisodeData && (
        <Flex align="center" direction="column">
          <Text fontWeight="500">No episode data</Text>
        </Flex>
      )}

      <ChakraRouterLink alignSelf="center" justifySelf="center" to={`${ROUTES.SHOW}/${showId}`}>
        <Button
          colorScheme="cyan"
          rightIcon={<BsArrowRightSquare />}
          size={isMobile ? 'xs' : 'sm'}
          variant="outline"
        >
          {noEpisodeData ? 'More Info' : 'More Episodes'}
        </Button>
      </ChakraRouterLink>
    </>
  );
};

export default EpisodeGroups;
