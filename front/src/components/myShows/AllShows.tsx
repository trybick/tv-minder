import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Heading, Image, Tooltip } from '@chakra-ui/core';
import { selectBasicShowInfoForAllShows } from 'store/tv/selectors';
import { fallBackImage } from 'utils/constants';

const AllShows = () => {
  const shows = useSelector(selectBasicShowInfoForAllShows);

  return (
    <Box mt="55px">
      <Heading as="h2" fontSize="lg" mb="18px" textAlign="center">
        All Shows
      </Heading>

      <Grid justifyContent="center" templateColumns="repeat(auto-fill, 300px)" gap={6}>
        {shows?.map(show => {
          const { name, posterPath } = show;
          const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

          return (
            <Grid
              borderWidth="1px"
              gap="19px"
              key={show.id}
              p={4}
              shadow="md"
              templateColumns="1fr 2fr"
            >
              <Tooltip aria-label={name} label={name} placement="top" hasArrow>
                <Box>
                  <Image borderRadius="6px" fallbackSrc={fallBackImage} src={posterSource} />
                </Box>
              </Tooltip>

              <Box minWidth="0">
                <Heading as="h4" fontSize="md" mb="10px" textAlign="center" isTruncated>
                  {name}
                </Heading>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AllShows;
