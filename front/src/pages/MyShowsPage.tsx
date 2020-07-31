import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Box, Grid, Image, Link, Text } from '@chakra-ui/core';
import { requestBasicShowInfoAction } from 'store/tv/actions';
import { selectBasicShowInfoForDisplay } from 'store/tv/selectors';

const MyShows = () => {
  const dispatch = useDispatch();
  const showInfo = useSelector(selectBasicShowInfoForDisplay);
  console.log('showInfo:', showInfo);

  useEffect(() => {
    dispatch(requestBasicShowInfoAction());
  }, [dispatch]);

  return (
    <Box maxW="80%" m="40px auto 0">
      <Grid justifyContent="center" templateColumns="repeat(auto-fill, 300px)" gap={12}>
        {showInfo.map(show => {
          const { backdropPath, id, lastEpisodeForDisplay, name } = show;

          const airDate = moment(lastEpisodeForDisplay.airDate);
          const today = moment().startOf('day');
          const daysAgo = moment.duration(today.diff(airDate)).asDays();
          const dateDisplay = daysAgo < 30 ? `${daysAgo} days ago` : airDate.format('M/D/YY');

          return (
            <Box key={id}>
              <Box>
                <Link>
                  <Image
                    borderRadius="5px"
                    src={`https://image.tmdb.org/t/p/w342${backdropPath}`}
                  />
                </Link>
              </Box>
              <Box mt="4px">
                <Text fontSize="xl" textAlign="center" isTruncated>
                  <Link>{name}</Link>
                </Text>
              </Box>
              <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" justifyItems="center" mt="10px">
                <Box>
                  <Text fontSize="m" textAlign="center">
                    {lastEpisodeForDisplay.seasonNumber}
                  </Text>
                  <Text fontSize="xs" textAlign="center">
                    Season
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="m" textAlign="center">
                    {lastEpisodeForDisplay.episodeNumber}
                  </Text>
                  <Text fontSize="xs" textAlign="center">
                    Episode
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="m" textAlign="center">
                    {dateDisplay}
                  </Text>
                  <Text fontSize="xs" textAlign="center">
                    Aired
                  </Text>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MyShows;
