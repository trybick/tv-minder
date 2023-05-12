import { useSelector } from 'react-redux';
import { Flex, Grid, Heading } from '@chakra-ui/react';
import {
  selectActiveSeasonShows,
  selectEndedShows,
  selectInProductionShows,
} from 'store/tv/selectors';
import Show from './Show';

const FollowingList = () => {
  const activeSeasonShows = useSelector(selectActiveSeasonShows);
  const inProductionShows = useSelector(selectInProductionShows);
  const endedShows = useSelector(selectEndedShows);

  return (
    <Flex direction="column" mt="28px">
      {activeSeasonShows?.length ? (
        <>
          <Heading as="h4" fontSize="23px" mb="20px" textAlign="center">
            Currently Airing
          </Heading>
          <Grid
            gap="30px 22px"
            gridTemplateColumns="repeat(auto-fit, 155px)"
            justifyContent="center"
            mb="38px"
          >
            {activeSeasonShows.map(show => (
              <Show key={show.id} show={show} />
            ))}
          </Grid>
        </>
      ) : null}

      {inProductionShows?.length ? (
        <>
          <Heading as="h4" fontSize="23px" mb="20px" textAlign="center">
            In Production
          </Heading>
          <Grid
            gap="30px 22px"
            gridTemplateColumns="repeat(auto-fit, 155px)"
            justifyContent="center"
            mb="38px"
          >
            {inProductionShows.map(show => (
              <Show key={show.id} show={show} />
            ))}
          </Grid>
        </>
      ) : null}

      {endedShows?.length ? (
        <>
          <Heading as="h4" fontSize="23px" mb="20px" textAlign="center">
            Ended
          </Heading>
          <Grid
            gap="30px 22px"
            gridTemplateColumns="repeat(auto-fit, 155px)"
            justifyContent="center"
            mb="38px"
          >
            {endedShows.map(show => (
              <Show key={show.id} show={show} />
            ))}
          </Grid>
        </>
      ) : null}
    </Flex>
  );
};

export default FollowingList;
