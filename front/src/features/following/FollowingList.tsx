import { Box, Tabs } from '@chakra-ui/react';
import { useState } from 'react';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectActiveSeasonShows,
  selectBasicShowInfoForFollowedShows,
  selectEndedShows,
  selectInProductionShows,
} from '~/store/tv/selectors';
import { applyViewTransition } from '~/utils/applyViewTransition';

import SubSectionOfShows from './SubSectionOfShows';

const FollowingList = () => {
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState<string | null>('all');

  const allFollowedShows = useAppSelector(selectBasicShowInfoForFollowedShows);
  const activeSeasonShows = useAppSelector(selectActiveSeasonShows);
  const inProductionShows = useAppSelector(selectInProductionShows);
  const endedShows = useAppSelector(selectEndedShows);

  return (
    <Box mt={isMobile ? '20px' : '32px'} px={isMobile ? '10px' : 'unset'}>
      <Tabs.Root
        colorPalette="cyan"
        defaultValue="all"
        m="0 auto"
        variant={isMobile ? 'enclosed' : 'line'}
        value={currentTab}
        onValueChange={e => applyViewTransition(() => setCurrentTab(e.value))}
        fitted
      >
        <Tabs.List mb="22px">
          <Tabs.Trigger value="all" fontSize="md">
            All
          </Tabs.Trigger>
          <Tabs.Trigger
            disabled={!activeSeasonShows.length}
            value="active"
            fontSize="md"
          >
            Airing Now
          </Tabs.Trigger>
          <Tabs.Trigger
            disabled={!inProductionShows.length}
            fontSize="md"
            value="inProduction"
          >
            In Production
          </Tabs.Trigger>
          <Tabs.Trigger
            disabled={!endedShows.length}
            value="ended"
            fontSize="md"
          >
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
