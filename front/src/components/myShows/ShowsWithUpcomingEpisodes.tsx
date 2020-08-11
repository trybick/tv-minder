import React from 'react';
import { useSelector } from 'react-redux';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Box,
  Grid,
  Heading,
  Image,
  Text,
  Tooltip,
} from '@chakra-ui/core';
import moment from 'moment';
import { selectBasicShowInfoForUpcomingEpisodes } from 'store/tv/selectors';
import { fallBackImage } from 'utils/constants';

const UpcomingEpisode = ({ show }: { show: any }) => {
  const {
    lastEpisodeForDisplay: { airDate, episodeNumber, name, overview, seasonNumber },
    name: showName,
    posterPath,
  } = show;
  const timeFromNow = moment(airDate).toNow();
  const seasonEpisodeNumber = `S${seasonNumber} E${episodeNumber}`;
  const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

  return (
    <AccordionItem>
      <AccordionHeader>
        <Grid
          alignItems="center"
          gap={3}
          justifyContent="start"
          templateColumns="110px 120px auto"
          width="100%"
        >
          <Badge variant="subtle" variantColor="purple">
            {timeFromNow}
          </Badge>

          <Text fontSize="sm" fontWeight="600" isTruncated>
            {seasonEpisodeNumber}
          </Text>

          <Text fontSize="sm" fontWeight="600" isTruncated>
            {showName}
          </Text>
        </Grid>
        <AccordionIcon />
      </AccordionHeader>

      <AccordionPanel pb={4}>
        <Grid alignItems="center" gap={6} templateColumns="100px 300px">
          <Tooltip aria-label={showName} label={showName} placement="right" hasArrow>
            <Box width="100px">
              <Image borderRadius="6px" fallbackSrc={fallBackImage} src={posterSource} />
            </Box>
          </Tooltip>

          <Grid templateRows="30px 1fr">
            <Box>
              <Heading as="h4" fontSize="md">
                {name}
              </Heading>
            </Box>

            <Box>
              <Text fontSize="sm">{overview}</Text>
            </Box>
          </Grid>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};

const ShowsWithUpcomingEpisodes = () => {
  const shows = useSelector(selectBasicShowInfoForUpcomingEpisodes);

  return (
    <Box alignSelf={{ base: 'center', lg: 'unset' }} ml={{ base: 0, lg: 50 }}>
      <Heading as="h2" fontSize="lg" mb="12px" textAlign="center">
        Upcoming
      </Heading>

      <Accordion>
        {shows?.map(show => (
          <UpcomingEpisode key={show.id} show={show} />
        ))}
      </Accordion>
    </Box>
  );
};

export default ShowsWithUpcomingEpisodes;
