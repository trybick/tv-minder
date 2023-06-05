import { useSelector } from 'react-redux';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
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
    <Tabs
      align="center"
      mt={isMobile ? '20px' : '32px'}
      px={isMobile ? '10px' : 'unset'}
      variant={isMobile ? 'enclosed' : 'solid-rounded'}
    >
      <TabList mb="18px">
        <Tab mr="4px">All Shows</Tab>
        <Tab isDisabled={!activeSeasonShows.length} mr="4px">
          Airing Now
        </Tab>
        <Tab isDisabled={!inProductionShows.length} mr="4px">
          In Production
        </Tab>
        <Tab isDisabled={!endedShows.length}>Ended</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SubSectionOfShows isMobile={isMobile} shows={allFollowedShows} />
        </TabPanel>
        <TabPanel>
          <SubSectionOfShows isMobile={isMobile} shows={activeSeasonShows} />
        </TabPanel>
        <TabPanel>
          <SubSectionOfShows isMobile={isMobile} shows={inProductionShows} />
        </TabPanel>
        <TabPanel>
          <SubSectionOfShows isMobile={isMobile} shows={endedShows} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default FollowingList;
