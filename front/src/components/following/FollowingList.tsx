import { useSelector } from 'react-redux';
import { Box, Tabs } from '@chakra-ui/react';
import { useIsMobile } from 'hooks/useIsMobile';
import {
  selectActiveSeasonShows,
  selectBasicShowInfoForFollowedShows,
  selectEndedShows,
  selectInProductionShows,
} from 'store/tv/selectors';
import SubSectionOfShows from './SubSectionOfShows';

const FollowingList = () => {
  const isMobile = useIsMobile();
  const allFollowedShows = useSelector(selectBasicShowInfoForFollowedShows);
  const activeSeasonShows = useSelector(selectActiveSeasonShows);
  const inProductionShows = useSelector(selectInProductionShows);
  const endedShows = useSelector(selectEndedShows);

  return (
    <Box mt={isMobile ? '20px' : '32px'} px={isMobile ? '10px' : 'unset'}>
      <Tabs.Root defaultValue="all" variant={isMobile ? 'enclosed' : 'enclosed'}>
        <Tabs.List mb="19px">
          <Tabs.Trigger mr="4px" value="all">
            All
          </Tabs.Trigger>
          <Tabs.Trigger disabled={!activeSeasonShows.length} mr="4px" value="active">
            Active Season
          </Tabs.Trigger>
          <Tabs.Trigger disabled={!inProductionShows.length} mr="4px" value="inProduction">
            In Production
          </Tabs.Trigger>
          <Tabs.Trigger disabled={!endedShows.length} value="ended">
            Ended
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="all">
          <SubSectionOfShows isMobile={isMobile} shows={allFollowedShows} />
        </Tabs.Content>

        <Tabs.Content value="active">
          <SubSectionOfShows isMobile={isMobile} shows={activeSeasonShows} />
        </Tabs.Content>

        <Tabs.Content value="inProduction">
          <SubSectionOfShows isMobile={isMobile} shows={inProductionShows} />
        </Tabs.Content>

        <Tabs.Content value="ended">
          <SubSectionOfShows isMobile={isMobile} shows={endedShows} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default FollowingList;
