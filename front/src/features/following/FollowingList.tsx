import { Box, Tabs } from '@chakra-ui/react';
import { useState } from 'react';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectActiveSeasonShows,
  selectEndedShows,
  selectFollowedShowsDetails,
  selectInProductionShows,
} from '~/store/tv/selectors';
import { applyViewTransition } from '~/utils/applyViewTransition';

import { SubSectionOfShows } from './SubSectionOfShows';

export const FollowingList = () => {
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState<string | null>('all');

  const followedShowsDetails = useAppSelector(selectFollowedShowsDetails);
  const activeSeasonShows = useAppSelector(selectActiveSeasonShows);
  const inProductionShows = useAppSelector(selectInProductionShows);
  const endedShows = useAppSelector(selectEndedShows);

  return (
    <Box mt={isMobile ? '20px' : '32px'} px={isMobile ? '10px' : 'unset'}>
      <Tabs.Root
        colorPalette="cyan"
        defaultValue="all"
        m="0 auto"
        variant="line"
        value={currentTab}
        onValueChange={e => applyViewTransition(() => setCurrentTab(e.value))}
        fitted={!isMobile}
        size={isMobile ? 'sm' : 'md'}
      >
        <Tabs.List
          mb="22px"
          gap={isMobile ? '2' : '0'}
          overflowX={isMobile ? 'auto' : 'visible'}
          overflowY="hidden"
          flexWrap={isMobile ? 'nowrap' : 'wrap'}
          px={isMobile ? '2' : '0'}
        >
          <Tabs.Trigger
            value="all"
            fontSize={isMobile ? 'sm' : 'md'}
            minW={isMobile ? 'max-content' : undefined}
            flexShrink={isMobile ? 0 : 1}
          >
            All
          </Tabs.Trigger>
          <Tabs.Trigger
            disabled={!activeSeasonShows.length}
            value="active"
            fontSize={isMobile ? 'sm' : 'md'}
            minW={isMobile ? 'max-content' : undefined}
            flexShrink={isMobile ? 0 : 1}
          >
            Airing Now
          </Tabs.Trigger>
          <Tabs.Trigger
            disabled={!inProductionShows.length}
            value="inProduction"
            fontSize={isMobile ? 'sm' : 'md'}
            minW={isMobile ? 'max-content' : undefined}
            flexShrink={isMobile ? 0 : 1}
          >
            In Production
          </Tabs.Trigger>
          <Tabs.Trigger
            disabled={!endedShows.length}
            value="ended"
            fontSize={isMobile ? 'sm' : 'md'}
            minW={isMobile ? 'max-content' : undefined}
            flexShrink={isMobile ? 0 : 1}
          >
            Ended
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="all">
          <SubSectionOfShows shows={followedShowsDetails} />
        </Tabs.Content>

        <Tabs.Content value="active">
          <SubSectionOfShows shows={activeSeasonShows} />
        </Tabs.Content>

        <Tabs.Content value="inProduction">
          <SubSectionOfShows shows={inProductionShows} />
        </Tabs.Content>

        <Tabs.Content value="ended">
          <SubSectionOfShows shows={endedShows} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
