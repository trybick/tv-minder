import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { MdRemoveCircleOutline } from 'react-icons/md';
import { selectBasicShowInfoForAllShows } from 'store/tv/selectors';
import { removeFromFollowedShowsAction } from 'store/user/actions';
import { fallbackImage } from 'utils/constants';
import { maybePluralize } from 'utils/formatting';

const FollowedShow = ({ show }: { show: any }) => {
  const dispatch = useDispatch();
  const { id: showId, name, numEpisodes, numSeasons, posterPath, status } = show;
  const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

  const onUnfollowShow = () => {
    dispatch(removeFromFollowedShowsAction(showId));
  };

  return (
    <Grid borderWidth="1px" gap="19px" key={show.id} p={4} shadow="md" templateColumns="1fr 3fr">
      <Tooltip aria-label={name} label={name} placement="top" hasArrow>
        <Box>
          <Image borderRadius="6px" fallbackSrc={fallbackImage} src={posterSource} />
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
              <MenuItem onClick={onUnfollowShow}>
                <Box as={MdRemoveCircleOutline} mr="8px" size="19px" />
                Unfollow
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>

        <Text fontSize="sm">
          {numSeasons} {maybePluralize(numSeasons, 'season')}
        </Text>
        <Text fontSize="sm">
          {numEpisodes} {maybePluralize(numEpisodes, 'episode')}
        </Text>
        <Text fontSize="sm">{status}</Text>
      </Box>
    </Grid>
  );
};

const AllFollowedShows = () => {
  const allShows = useSelector(selectBasicShowInfoForAllShows);

  return (
    <Box mt="55px">
      <Heading as="h2" fontSize="xl" mb="18px" textAlign="center">
        Following
      </Heading>

      {allShows.length ? (
        <Grid justifyContent="center" templateColumns="repeat(auto-fill, 400px)" gap={6}>
          {allShows.map(show => (
            <FollowedShow key={show.id} show={show} />
          ))}
        </Grid>
      ) : (
        <Box>
          <Text fontSize="sm" textAlign="center">
            Start following your favorite shows to track them here!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default AllFollowedShows;
