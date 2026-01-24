import { Box, Tabs } from '@chakra-ui/react';
import { useState } from 'react';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectActiveSeasonShows,
  selectEndedShows,
  selectFollowedShowsDetails,
  selectInProductionShows,
  selectPremieringSoonShows,
} from '~/store/tv/selectors';
import { applyViewTransition } from '~/utils/applyViewTransition';

import { SubSectionOfShows } from './SubSectionOfShows';

const tabs = {
  all: 'all',
  active: 'active',
  premieringSoon: 'premieringSoon',
  inProduction: 'inProduction',
  ended: 'ended',
};

export const FollowingList = () => {
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState<keyof typeof tabs>('all');

  const followedShowsDetails = useAppSelector(selectFollowedShowsDetails);
  const activeSeasonShows = useAppSelector(selectActiveSeasonShows);
  const inProductionShows = useAppSelector(selectInProductionShows);
  const premieringSoonShows = useAppSelector(selectPremieringSoonShows);
  const endedShows = useAppSelector(selectEndedShows);

  const tabLabels = {
    all: 'All',
    active: isMobile ? 'Current' : 'Airing Now',
    premieringSoon: isMobile ? 'Soon' : 'Premiering Soon',
    inProduction: isMobile ? 'Production' : 'In Production',
    ended: 'Ended',
  };

  return (
    <Box mt={isMobile ? '20px' : '32px'} px={isMobile ? '10px' : 'unset'}>
      <Tabs.Root
        colorPalette="cyan"
        defaultValue={tabs.all}
        m="0 auto"
        variant="line"
        value={currentTab}
        onValueChange={e =>
          applyViewTransition(() => setCurrentTab(e.value as keyof typeof tabs))
        }
        fitted={false}
        size={isMobile ? 'sm' : 'md'}
      >
        <Tabs.List
          mb="22px"
          gap={isMobile ? '2' : '0'}
          overflowX={isMobile ? 'auto' : 'visible'}
          overflowY="hidden"
          flexWrap={isMobile ? 'nowrap' : 'wrap'}
          justifyContent="center"
          maxW={isMobile ? '100%' : '720px'}
          w={isMobile ? '100%' : 'auto'}
          mx={isMobile ? '0' : 'auto'}
          px={isMobile ? '2' : '0'}
          whiteSpace="nowrap"
        >
          <Tabs.Trigger
            value={tabs.all}
            fontSize={isMobile ? 'sm' : 'md'}
            minW={isMobile ? 'max-content' : undefined}
            flexShrink={isMobile ? 0 : 1}
            px={isMobile ? 2 : 'unset'}
          >
            {tabLabels.all}
          </Tabs.Trigger>
          <Tabs.Trigger
            disabled={!activeSeasonShows.length}
            value={tabs.active}
            fontSize={isMobile ? 'sm' : 'md'}
            minW={isMobile ? 'max-content' : undefined}
            flexShrink={isMobile ? 0 : 1}
            px={isMobile ? 2 : 'unset'}
          >
            {tabLabels.active}
          </Tabs.Trigger>
          <Tabs.Trigger
            disabled={!premieringSoonShows.length}
            value={tabs.premieringSoon}
            fontSize={isMobile ? 'sm' : 'md'}
            minW={isMobile ? 'max-content' : undefined}
            flexShrink={isMobile ? 0 : 1}
            px={isMobile ? 2 : 'unset'}
          >
            {tabLabels.premieringSoon}
          </Tabs.Trigger>
          <Tabs.Trigger
            disabled={!inProductionShows.length}
            value={tabs.inProduction}
            fontSize={isMobile ? 'sm' : 'md'}
            minW={isMobile ? 'max-content' : undefined}
            flexShrink={isMobile ? 0 : 1}
            px={isMobile ? 2 : 'unset'}
          >
            {tabLabels.inProduction}
          </Tabs.Trigger>
          <Tabs.Trigger
            disabled={!endedShows.length}
            value={tabs.ended}
            fontSize={isMobile ? 'sm' : 'md'}
            minW={isMobile ? 'max-content' : undefined}
            flexShrink={isMobile ? 0 : 1}
            px={isMobile ? 2 : 'unset'}
          >
            {tabLabels.ended}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value={tabs.all}>
          <SubSectionOfShows shows={followedShowsDetails} />
        </Tabs.Content>

        <Tabs.Content value={tabs.active}>
          <SubSectionOfShows shows={activeSeasonShows} />
        </Tabs.Content>

        <Tabs.Content value={tabs.premieringSoon}>
          <SubSectionOfShows shows={premieringSoonShows} />
        </Tabs.Content>

        <Tabs.Content value={tabs.inProduction}>
          <SubSectionOfShows shows={inProductionShows} />
        </Tabs.Content>

        <Tabs.Content value={tabs.ended}>
          <SubSectionOfShows shows={endedShows} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
