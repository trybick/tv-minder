import { Flex, Icon, Link, Text } from '@chakra-ui/react';
import { type MouseEvent } from 'react';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import {
  type NavigationItem,
  useNavigationConfig,
} from '~/hooks/useNavigationConfig';
import { useAppDispatch } from '~/store';
import { setShouldResetSearchInput } from '~/store/rtk/slices/searchInput.slice';

export const bottomTabBarHeight = '56px';

export const BottomTabBar = () => {
  const dispatch = useAppDispatch();
  const { visibleMainNavItems } = useNavigationConfig();
  const [location, navigate] = useLocation();

  const handleClick =
    (tab: NavigationItem) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (tab.route === ROUTES.HOME) {
        dispatch(setShouldResetSearchInput(true));
      }
      navigate(tab.route);
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
      {visibleMainNavItems.map(tab => {
        const isActive = location === tab.route;

        return (
          <Link
            key={tab.route}
            href={tab.route}
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
              {tab.label}
            </Text>
          </Link>
        );
      })}
    </Flex>
  );
};
