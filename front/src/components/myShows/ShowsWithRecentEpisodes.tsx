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
  const { lastEpisodeForDisplay, name, posterPath } = show;
  const timeFromNow = moment(lastEpisodeForDisplay.airDate).fromNow();
  const seasonEpisodeNumber = `S${lastEpisodeForDisplay.seasonNumber} E${lastEpisodeForDisplay.episodeNumber}`;
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
            {name}
          </Text>
        </Grid>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4}>
        <Tooltip aria-label={name} label={name} placement="top" hasArrow>
          <Box width="50px">
            <Image borderRadius="6px" src={posterSource} />
          </Box>
        </Tooltip>
        ; Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
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
