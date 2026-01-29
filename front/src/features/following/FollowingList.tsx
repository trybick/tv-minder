import { Box, Tabs } from '@chakra-ui/react';
import { useState } from 'react';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import {
  selectActiveSeasonShows,
  selectEndedShows,
  selectFollowedShowsDetails,
  selectInProductionShows,
  selectPremieringSoonShows,
} from '~/store/tv/selectors';
import { applyViewTransition } from '~/utils/applyViewTransition';

import { FollowingTabTrigger } from './FollowingTabTrigger';
import { SubSectionOfShows } from './SubSectionOfShows';

const tabs = {
  all: 'all',
  active: 'active',
  premieringSoon: 'premieringSoon',
  inProduction: 'inProduction',
  ended: 'ended',
};

export const FollowingList = () => {
  const { isMobile } = useResponsiveLayout();
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
          <FollowingTabTrigger value={tabs.all} label={tabLabels.all} />
          <FollowingTabTrigger
            value={tabs.active}
            label={tabLabels.active}
            isDisabled={!activeSeasonShows.length}
          />
          <FollowingTabTrigger
            value={tabs.premieringSoon}
            label={tabLabels.premieringSoon}
            isDisabled={!premieringSoonShows.length}
          />
          <FollowingTabTrigger
            value={tabs.inProduction}
            label={tabLabels.inProduction}
            isDisabled={!inProductionShows.length}
          />
          <FollowingTabTrigger
            value={tabs.ended}
            label={tabLabels.ended}
            isDisabled={!endedShows.length}
          />
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
