import { Flex, Icon, Link, Text } from '@chakra-ui/react';
import { type MouseEvent } from 'react';
import type { IconType } from 'react-icons';
import { FiCalendar, FiCompass, FiList } from 'react-icons/fi';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import { useAppDispatch, useAppSelector } from '~/store';
import { setShouldResetSearchInput } from '~/store/rtk/slices/searchInput.slice';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';

type Tab = {
  linkTo: string;
  text: string;
  icon: IconType;
  requiresAuth?: boolean;
};

const tabs: Tab[] = [
  { linkTo: ROUTES.HOME, text: 'Discover', icon: FiCompass },
  { linkTo: ROUTES.CALENDAR, text: 'Calendar', icon: FiCalendar },
  { linkTo: ROUTES.MANAGE, text: 'Manage', icon: FiList, requiresAuth: true },
];

export const bottomTabBarHeight = '56px';

export const BottomTabBar = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [location, navigate] = useLocation();

  const visibleTabs = tabs.filter(tab => !tab.requiresAuth || isLoggedIn);

  const handleClick = (tab: Tab) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (tab.linkTo === ROUTES.HOME) {
      dispatch(setShouldResetSearchInput(true));
    }
    navigate(tab.linkTo);
  };

  return (
    <Flex
      as="nav"
      aria-label="Primary"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="banner"
      bg="bg.muted/75"
      backdropFilter="blur(12px)"
      borderTopWidth="1px"
      borderColor="whiteAlpha.100"
      pb="env(safe-area-inset-bottom)"
    >
      {visibleTabs.map(tab => {
        const isActive = location === tab.linkTo;

        return (
          <Link
            key={tab.linkTo}
            href={tab.linkTo}
            onClick={handleClick(tab)}
            aria-current={isActive ? 'page' : undefined}
            flex="1"
            h={bottomTabBarHeight}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="0.5"
            color={isActive ? 'cyan.300' : 'fg.muted'}
            transition="color 150ms"
            _hover={{
              textDecoration: 'none',
              color: isActive ? 'cyan.300' : 'fg',
            }}
            _focusVisible={{ outline: 'none', bg: 'whiteAlpha.100' }}
          >
            <Icon as={tab.icon} boxSize={5} />
            <Text fontSize="2xs" fontWeight="semibold" lineHeight="1">
              {tab.text}
            </Text>
          </Link>
        );
      })}
    </Flex>
  );
};
