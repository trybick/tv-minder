import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Grid,
  Heading,
  Image,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import moment from 'moment';
import Truncate from 'react-truncate';
import { selectBasicShowInfoForRecentEpisodes } from 'store/tv/selectors';
import { fallbackImagePath } from 'constants/strings';
import { getTimeFromNowForRecent } from './common/utils';
import { useIsMobile } from 'hooks/useIsMobile';

const ShowsWithRecentEpisodes = () => {
  const recentShows = useSelector(selectBasicShowInfoForRecentEpisodes);
  const isMobile = useIsMobile();

  const createAccordionItems = useCallback(
    () =>
      recentShows.map(show => {
        const {
          lastEpisodeForDisplay: { airDate, episodeNumber, name, overview, seasonNumber },
          name: showName,
          posterPath,
        } = show;
        const seasonEpisodeNumber = `S${seasonNumber} E${episodeNumber}`;
        const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

        return (
          <AccordionItem key={show.id}>
            <AccordionButton>
              <Grid
                alignItems="center"
                gap={3}
                justifyContent="start"
                templateColumns={{ base: '110px 70px auto', xl: '110px 120px auto' }}
                width="100%"
              >
                <Badge colorScheme="red" variant="subtle">
                  {getTimeFromNowForRecent(airDate)}
                </Badge>

                <Text fontSize="sm" fontWeight="600" isTruncated>
                  {seasonEpisodeNumber}
                </Text>

                <Text fontSize="sm" fontWeight="600" mr="12px" isTruncated>
                  {showName}
                </Text>
              </Grid>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel pb={4}>
              <Grid alignItems="center" gap={6} templateColumns="1fr 3fr">
                <Tooltip aria-label={showName} label={showName} placement="right" hasArrow>
                  <Box>
                    <Image
                      alt={`${showName} image`}
                      borderRadius="6px"
                      fallbackSrc={fallbackImagePath}
                      src={posterSource}
                    />
                  </Box>
                </Tooltip>

                <Grid templateRows="24px 1fr">
                  <Heading as="h4" fontSize="md" isTruncated>
                    {name}
                  </Heading>

                  <Box mb="8px">
                    <Text as="i" fontSize="sm">
                      {moment(airDate).format('dddd, MMMM Do')}
                    </Text>
                  </Box>

                  <Box maxH="63px" overflow="hidden">
                    <Text fontSize="sm">
                      <Truncate lines={isMobile ? 2 : 3}>{overview}</Truncate>
                    </Text>
                  </Box>
                </Grid>
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        );
      }),
    [recentShows, isMobile]
  );

  return (
    <Box
      alignSelf={{ base: 'center', xl: 'unset' }}
      ml={{ base: 0, xl: 50 }}
      mt={{ base: 50, xl: 0 }}
      width={{ base: 350, lg: 530 }}
    >
      <Heading as="h2" fontSize="xl" mb="14px" textAlign="center">
        Recent
      </Heading>

      {recentShows.length ? (
        <Accordion allowMultiple={false} allowToggle={true} defaultIndex={[-1]}>
          {createAccordionItems()}
        </Accordion>
      ) : (
        <Box>
          <Text fontSize="sm" textAlign="center">
            Currently no recent shows
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ShowsWithRecentEpisodes;
