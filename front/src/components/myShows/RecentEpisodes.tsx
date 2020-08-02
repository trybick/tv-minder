import React from 'react';
import moment from 'moment';
import { Box, Grid, Image, Text, Tooltip } from '@chakra-ui/core';
import { MdNewReleases } from 'react-icons/md';

interface Props {
  showsInfo: any[];
}

const RecentEpisodes = ({ showsInfo }: Props) => (
  <Grid justifyContent="center" templateColumns="repeat(auto-fill, 300px)" gap={12}>
    {showsInfo?.map(show => {
      const { id, lastEpisodeForDisplay, name, posterPath } = show;
      const posterSource = `https://image.tmdb.org/t/p/w185${posterPath}`;
      const airDate = lastEpisodeForDisplay.airDate;
      const timeFromNow = moment(airDate).fromNow();
      const isRecent = moment().startOf('day').diff(airDate, 'days') <= 10;

      return (
        <Box key={id}>
          <Grid mt="5px" templateColumns="1fr 5fr">
            <Tooltip aria-label={name} label={name} placement="bottom" hasArrow>
              <Box>
                <Image borderRadius="5px" src={posterSource} />
              </Box>
            </Tooltip>

            <Box>
              <Grid>
                <Box>
                  <Text fontSize="m" textAlign="center">
                    {isRecent && <Box as={MdNewReleases} display="inline" size="19px" />}{' '}
                    {timeFromNow}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="m" textAlign="center">
                    Episode {lastEpisodeForDisplay.episodeNumber}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="m" textAlign="center">
                    Season {lastEpisodeForDisplay.seasonNumber}
                  </Text>
                </Box>
              </Grid>
            </Box>
          </Grid>
        </Box>
      );
    })}
  </Grid>
);

export default RecentEpisodes;
