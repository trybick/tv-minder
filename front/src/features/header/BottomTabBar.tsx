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
const bottomTabBarSafeArea = '20px';
export const bottomTabBarTotalHeight = `calc(${bottomTabBarHeight} + ${bottomTabBarSafeArea})`;

export const BottomTabBar = () => {
  const dispatch = useAppDispatch();
  const { visibleMainNavItems } = useNavigationConfig();
  const [location, navigate] = useLocation();

  const handleClick =
    (tab: NavigationItem) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      event.currentTarget.blur();
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
      flexShrink="0"
      h={bottomTabBarTotalHeight}
      pb={bottomTabBarSafeArea}
      bg="bg.muted/75"
      backdropFilter="blur(12px)"
      borderTopWidth="1px"
      borderColor="whiteAlpha.100"
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
            h="full"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="0.5"
            color={isActive ? 'cyan.300' : 'fg.muted'}
            transition="color 150ms"
            outline="none"
            css={{ WebkitTapHighlightColor: 'transparent' }}
            _hover={{
              textDecoration: 'none',
              color: isActive ? 'cyan.300' : 'fg',
            }}
            _focus={{ outline: 'none', boxShadow: 'none', bg: 'transparent' }}
            _focusVisible={{
              outline: '2px solid',
              outlineColor: 'cyan.300',
              outlineOffset: '-2px',
            }}
          >
            <Icon as={tab.icon} boxSize={5} />
            <Text
              fontSize="2xs"
              fontWeight="semibold"
              lineHeight="1"
              whiteSpace="nowrap"
            >
              {tab.label}
            </Text>
          </Link>
        );
      })}
    </Flex>
  );
};
