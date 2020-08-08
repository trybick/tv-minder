import React from 'react';
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

interface Props {
  shows: any[];
}

const RecentEpisode = ({ show }: { show: any }) => {
  const {
    lastEpisodeForDisplay: { airDate, episodeNumber, name, overview, seasonNumber },
    name: showName,
    posterPath,
  } = show;
  const timeFromNow = moment(airDate).fromNow();
  const seasonEpisodeNumber = `S${seasonNumber} E${episodeNumber}`;
  const posterSource = `https://image.tmdb.org/t/p/w185${posterPath}`;

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
          <Badge variant="subtle" variantColor="red">
            {timeFromNow}
          </Badge>

          <Text fontSize="sm" fontWeight="700" isTruncated>
            {seasonEpisodeNumber}
          </Text>

          <Text fontSize="sm" fontWeight="700" isTruncated>
            {showName}
          </Text>
        </Grid>
        <AccordionIcon />
      </AccordionHeader>

      <AccordionPanel pb={4}>
        <Grid alignItems="center" gap={6} templateColumns="100px 1fr">
          <Tooltip aria-label={showName} label={showName} placement="right" hasArrow>
            <Box width="100px">
              <Image borderRadius="6px" src={posterSource} />
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

const ShowsWithRecentEpisodes = ({ shows }: Props) => (
  <Box>
    <Heading as="h2" fontSize="lg" mb="12px">
      Recently Aired
    </Heading>

    <Accordion width="45%">
      {shows?.map(show => (
        <RecentEpisode key={show.id} show={show} />
      ))}
    </Accordion>
  </Box>
);

export default ShowsWithRecentEpisodes;
