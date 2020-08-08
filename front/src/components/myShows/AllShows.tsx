import React from 'react';
import { Badge, Box, Grid, Heading, Image, Tooltip } from '@chakra-ui/core';
import moment from 'moment';

interface Props {
  showsInfo: any[];
}

const AllShows = ({ showsInfo }: Props) => (
  <Box>
    <Heading as="h2" fontSize="lg">
      All Shows
    </Heading>

    <Grid justifyContent="center" templateColumns="repeat(auto-fill, 300px)" gap={6}>
      {showsInfo?.map(show => {
        const { lastEpisodeForDisplay, name, nextEpisodeForDisplay, posterPath } = show;
        const posterSource = `https://image.tmdb.org/t/p/w185${posterPath}`;

        const lastEpisode = lastEpisodeForDisplay.airDate && {
          isRecent: moment().startOf('day').diff(lastEpisodeForDisplay.airDate, 'days') < 7,
          text: `S${lastEpisodeForDisplay.seasonNumber} E${lastEpisodeForDisplay.episodeNumber}`,
          timeFromNow: moment(lastEpisodeForDisplay.airDate).fromNow(),
        };

        const nextEpisode = nextEpisodeForDisplay.airDate && {
          isSoon: moment(nextEpisodeForDisplay.airDate).diff(moment().startOf('day'), 'days') < 7,
          text: `S${nextEpisodeForDisplay.seasonNumber} E${nextEpisodeForDisplay.episodeNumber}`,
          timeUntil: moment(nextEpisodeForDisplay.airDate).fromNow(),
        };

        return (
          <Grid borderWidth="1px" gap="19px" p={4} shadow="md" templateColumns="1fr 2fr">
            <Tooltip aria-label={name} label={name} placement="top" hasArrow>
              <Box>
                <Image borderRadius="6px" src={posterSource} />
              </Box>
            </Tooltip>

            <Box minWidth="0">
              <Heading as="h4" fontSize="md" mb="10px" textAlign="center" isTruncated>
                {name}
              </Heading>

              {nextEpisode && (
                <Box display="grid" gridTemplateColumns="1fr 4fr" mb="15px">
                  <Box>
                    <Heading alignSelf="center" as="h5" fontSize="sm" textAlign="center">
                      Upcoming
                    </Heading>
                    <Badge variant="solid" variantColor="purple">
                      {nextEpisode.timeUntil} - {nextEpisode.text}
                    </Badge>
                  </Box>
                </Box>
              )}

              {lastEpisode && (
                <Box display="grid" gridTemplateColumns="1fr 2fr">
                  <Box>
                    <Heading alignSelf="center" as="h5" fontSize="sm" textAlign="center">
                      Last aired
                    </Heading>
                    <Badge variant="subtle" variantColor="red">
                      {lastEpisode.timeFromNow} - {lastEpisode.text}
                    </Badge>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Box>
);

export default AllShows;
