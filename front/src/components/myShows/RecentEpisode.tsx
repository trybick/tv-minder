import React from 'react';
import { Badge, Box, Flex, Grid, Heading, Image, Tag, Text, Tooltip } from '@chakra-ui/core';
import moment from 'moment';
import { MdNewReleases } from 'react-icons/md';

interface Props {
  show: any;
}

const RecentEpisode = ({ show }: Props) => {
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
    timeUntil: moment(nextEpisodeForDisplay.airDate).toNow(),
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
          <Box display="grid" gridTemplateColumns="1fr 2fr" mb="15px">
            <Box>
              <Heading alignSelf="center" as="h5" fontSize="sm" textAlign="center">
                Upcoming
              </Heading>
              <Text fontSize="m" textAlign="center">
                {/* {nextEpisode.isSoon && <Box as={MdNewReleases} display="inline" size="19px" />}{' '} */}
                <Badge variant="solid" variantColor="purple">
                  {nextEpisode.timeUntil}
                </Badge>
              </Text>
            </Box>

            <Text alignSelf="center" fontSize="m" textAlign="center">
              <Tag size="sm">{nextEpisode.text}</Tag>
            </Text>
          </Box>
        )}

        {lastEpisode && (
          <Box display="grid" gridTemplateColumns="1fr 2fr">
            <Box>
              <Heading alignSelf="center" as="h5" fontSize="sm" textAlign="center">
                Last aired
              </Heading>
              <Text fontSize="m" textAlign="center">
                {/* {lastEpisode.isRecent && <Box as={MdNewReleases} display="inline" size="19px" />}{' '} */}
                <Badge variant="subtle" variantColor="red">
                  {lastEpisode.timeFromNow}
                </Badge>
              </Text>
            </Box>

            <Text alignSelf="center" fontSize="m" textAlign="center">
              <Tag size="sm">{lastEpisode.text}</Tag>
            </Text>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default RecentEpisode;
