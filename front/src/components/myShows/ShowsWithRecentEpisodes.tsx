import React from 'react';
import { useSelector } from 'react-redux';
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
import { selectBasicShowInfoForRecentEpisodes } from 'store/tv/selectors';
import { fallBackImage } from 'utils/constants';
import { maybePluralize } from 'utils/formatting';

const RecentEpisode = ({ show }: { show: any }) => {
  const {
    lastEpisodeForDisplay: { airDate, episodeNumber, name, overview, seasonNumber },
    name: showName,
    posterPath,
  } = show;
  const seasonEpisodeNumber = `S${seasonNumber} E${episodeNumber}`;
  const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

  // Moment's 'timeFromNow' would be nice here, but recent shows display as 'X hours ago'
  const getTimeFromNow = () => {
    let timeFromNow;
    const daysDiff = moment(moment().startOf('day')).diff(airDate, 'days');
    const weeksDiff = moment.duration(daysDiff, 'days').weeks();
    const monthsDiff = moment.duration(daysDiff, 'days').months();

    if (daysDiff < 7) {
      timeFromNow = `${daysDiff} ${maybePluralize(daysDiff, 'day')} ago`;
    } else if (daysDiff < 28) {
      timeFromNow = `${weeksDiff} ${maybePluralize(weeksDiff, 'week')} ago`;
    } else {
      timeFromNow = `${monthsDiff} ${maybePluralize(monthsDiff, 'month')} ago`;
    }

    return timeFromNow;
  };

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
            {getTimeFromNow()}
          </Badge>

          <Text fontSize="sm" fontWeight="600" isTruncated>
            {seasonEpisodeNumber}
          </Text>

          <Text fontSize="sm" fontWeight="600" mr="12px" isTruncated>
            {showName}
          </Text>
        </Grid>
        <AccordionIcon />
      </AccordionHeader>

      <AccordionPanel pb={4}>
        <Grid alignItems="center" gap={6} templateColumns="100px 300px">
          <Tooltip aria-label={showName} label={showName} placement="right" hasArrow>
            <Box width="100px">
              <Image borderRadius="6px" fallbackSrc={fallBackImage} src={posterSource} />
            </Box>
          </Tooltip>

          <Grid templateRows="30px 1fr">
            <Box>
              <Heading as="h4" fontSize="md">
                {name}
              </Heading>
            </Box>

            <Box mb="8px">
              <Text fontSize="sm">{moment(airDate).format('dddd, MMMM Do')}</Text>
            </Box>

            <Box maxH="63px" overflow="hidden">
              <Text fontSize="sm">{overview}</Text>
            </Box>
          </Grid>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};

const ShowsWithRecentEpisodes = () => {
  const shows = useSelector(selectBasicShowInfoForRecentEpisodes);

  return (
    <Box
      alignSelf={{ base: 'center', lg: 'unset' }}
      ml={{ base: 0, lg: 50 }}
      mt={{ base: 50, lg: 0 }}
      width="530px"
    >
      <Heading as="h2" fontSize="xl" mb="14px" textAlign="center">
        Recent
      </Heading>

      <Accordion>
        {shows?.map(show => (
          <RecentEpisode key={show.id} show={show} />
        ))}
      </Accordion>
    </Box>
  );
};

export default ShowsWithRecentEpisodes;
