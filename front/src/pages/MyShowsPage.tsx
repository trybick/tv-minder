import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Box, Grid, Heading, Image, Link, Text, Tooltip } from '@chakra-ui/core';
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
          const { id, lastEpisodeForDisplay, name, posterPath } = show;

          const airDate = moment(lastEpisodeForDisplay.airDate);
          const today = moment().startOf('day');
          const daysAgo = moment.duration(today.diff(airDate)).asDays();
          const dateDisplay = daysAgo < 30 ? `${daysAgo} days ago` : airDate.format('M/D/YY');

          return (
            <Box key={id}>
              <Grid mt="5px" templateColumns="3fr 5fr">
                <Tooltip aria-label={name} label={name} placement="bottom">
                  <Box>
                    <Image
                      borderRadius="5px"
                      src={`https://image.tmdb.org/t/p/w185${posterPath}`}
                    />
                  </Box>
                </Tooltip>

                <Box>
                  <Grid>
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
                    <Box>
                      <Text fontSize="m" textAlign="center">
                        Aired: {dateDisplay}
                      </Text>
                    </Box>
                  </Grid>
                </Box>
              </Grid>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MyShows;
