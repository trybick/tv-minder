import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Heading,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Tooltip,
} from '@chakra-ui/core';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaRegStar } from 'react-icons/fa';
import { MdRemoveCircleOutline } from 'react-icons/md';
import { selectBasicShowInfoForAllShows } from 'store/tv/selectors';
import { fallBackImage } from 'utils/constants';

const AllShows = () => {
  const shows = useSelector(selectBasicShowInfoForAllShows);
  console.log('all shows:', shows);

  return (
    <Box mt="55px">
      <Heading as="h2" fontSize="lg" mb="18px" textAlign="center">
        All Shows
      </Heading>

      <Grid justifyContent="center" templateColumns="repeat(auto-fill, 400px)" gap={6}>
        {shows?.map(show => {
          const { name, numEpisodes, numSeasons, posterPath, status } = show;
          const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

          return (
            <Grid
              borderWidth="1px"
              gap="19px"
              key={show.id}
              p={4}
              shadow="md"
              templateColumns="1fr 3fr"
            >
              <Tooltip aria-label={name} label={name} placement="top" hasArrow>
                <Box>
                  <Image borderRadius="6px" fallbackSrc={fallBackImage} src={posterSource} />
                </Box>
              </Tooltip>

              <Box minWidth="0">
                <Box display="flex" justifyContent="space-between">
                  <Heading as="h4" fontSize="md" mb="10px" textAlign="center" isTruncated>
                    {name}
                  </Heading>

                  <Menu>
                    <MenuButton>
                      <Box as={BsThreeDotsVertical} size="19px" />
                    </MenuButton>
                    <MenuList placement="bottom-end">
                      <MenuItem>
                        <Box as={FaRegStar} mr="8px" size="19px" />
                        Favorite
                      </MenuItem>
                      <MenuItem>
                        <Box as={MdRemoveCircleOutline} mr="8px" size="19px" />
                        Unfollow
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>

                <Text fontSize="sm">{numSeasons} seasons</Text>
                <Text fontSize="sm">{numEpisodes} episodes</Text>
                <Text fontSize="sm">{status}</Text>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AllShows;
