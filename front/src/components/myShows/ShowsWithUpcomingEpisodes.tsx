import React from 'react';
import { useSelector } from 'react-redux';
import {
  Accordion,
  AccordionHeader,
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
} from '@chakra-ui/core';
import moment from 'moment';
import Truncate from 'react-truncate';
import { selectBasicShowInfoForUpcomingEpisodes } from 'store/tv/selectors';
import { fallbackImagePath } from 'constants/strings';
import { getTimeFromNowForUpcoming } from './common/utils';
import { BasicShowInfo } from 'types/external';
import { useIsMobile } from 'hooks/useIsMobile';

const createAccordionItems = (shows: BasicShowInfo[], isMobile: boolean) =>
  shows.map(show => {
    const {
      nextEpisodeForDisplay: { airDate, episodeNumber, name, overview, seasonNumber },
      name: showName,
      posterPath,
    } = show;
    const seasonEpisodeNumber = `S${seasonNumber} E${episodeNumber}`;
    const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

    return (
      <AccordionItem key={show.id}>
        <AccordionHeader>
          <Grid
            alignItems="center"
            gap={3}
            justifyContent="start"
            templateColumns={{ base: '110px 70px auto', xl: '110px 120px auto' }}
            width="100%"
          >
            <Badge variant="subtle" variantColor="purple">
              {getTimeFromNowForUpcoming(airDate)}
            </Badge>

            <Text fontSize="sm" fontWeight="600" isTruncated>
              {seasonEpisodeNumber}
            </Text>

            <Text fontSize="sm" fontWeight="600" mr="12px" isTruncated>
              {showName}
            </Text>
          </Grid>
          <AccordionIcon />
        </AccordionHeader>

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
  });

const ShowsWithUpcomingEpisodes = () => {
  const upcomingShows = useSelector(selectBasicShowInfoForUpcomingEpisodes);
  const isMobile = useIsMobile();

  return (
    <Box
      alignSelf={{ base: 'center', xl: 'unset' }}
      ml={{ base: 0, xl: 50 }}
      width={{ base: 350, lg: 530 }}
    >
      <Heading as="h2" fontSize="xl" mb="14px" textAlign="center">
        Upcoming
      </Heading>

      {upcomingShows.length ? (
        <Accordion allowMultiple={false} allowToggle={true} defaultIndex={[-1]}>
          {createAccordionItems(upcomingShows, isMobile)}
        </Accordion>
      ) : (
        <Box>
          <Text fontSize="sm" textAlign="center">
            Currently no upcoming shows
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ShowsWithUpcomingEpisodes;
