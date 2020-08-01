import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Box, Grid, Image, Text, Tooltip } from '@chakra-ui/core';
import { MdNewReleases } from 'react-icons/md';
import { requestBasicShowInfoAction } from 'store/tv/actions';
import { selectBasicShowInfoForDisplay } from 'store/tv/selectors';
import { selectFollowedShows } from 'store/user/selectors';

const MyShows = () => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);
  const showInfo = useSelector(selectBasicShowInfoForDisplay);
  console.log('showInfo:', showInfo);

  useEffect(() => {
    dispatch(requestBasicShowInfoAction());
  }, [dispatch, followedShows]);

  return (
    <Box maxW="80%" m="40px auto 0">
      <Grid justifyContent="center" templateColumns="repeat(auto-fill, 300px)" gap={12}>
        {showInfo.map(show => {
          const { id, lastEpisodeForDisplay, name, posterPath } = show;
          const airDate = lastEpisodeForDisplay.airDate;
          const timeFromNow = moment(airDate).fromNow();
          const isRecent = moment().startOf('day').diff(airDate, 'days') <= 10;

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
    </Box>
  );
};

export default MyShows;
