import type { IconType } from 'react-icons';
import { FiCalendar, FiCompass, FiList, FiSettings } from 'react-icons/fi';

import { ROUTES } from '~/app/routes';
import { useAppSelector } from '~/store';
import {
  selectIsGoogleUser,
  selectIsLoggedIn,
} from '~/store/rtk/slices/user.slice';

export type NavigationItemId = 'discover' | 'calendar' | 'manage' | 'settings';

export type NavigationItem = {
  id: NavigationItemId;
  label: string;
  route: string;
  icon: IconType;
  requiresAuth?: boolean;
  hideForGoogleUser?: boolean;
};

const navigationItems: NavigationItem[] = [
  { id: 'discover', label: 'Discover', route: ROUTES.HOME, icon: FiCompass },
  {
    id: 'calendar',
    label: 'Calendar',
    route: ROUTES.CALENDAR,
    icon: FiCalendar,
  },
  {
    id: 'manage',
    label: 'Manage',
    route: ROUTES.MANAGE,
    icon: FiList,
    requiresAuth: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    route: ROUTES.SETTINGS,
    icon: FiSettings,
    requiresAuth: true,
    hideForGoogleUser: true,
  },
];

const settingsNavigationItem = navigationItems.find(
  item => item.id === 'settings'
)!;

const mainNavigationItems = navigationItems.filter(
  item => item.id !== 'settings'
);

const isNavigationItemVisible = (
  item: NavigationItem,
  { isLoggedIn, isGoogleUser }: { isLoggedIn: boolean; isGoogleUser: boolean }
) => {
  if (item.requiresAuth && !isLoggedIn) {
    return false;
  }

  if (item.hideForGoogleUser && isGoogleUser) {
    return false;
  }

  return true;
};

export const useNavigationConfig = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isGoogleUser = useAppSelector(selectIsGoogleUser);

  const auth = { isLoggedIn, isGoogleUser };

  return {
    isLoggedIn,
    isGoogleUser,
    visibleMainNavItems: mainNavigationItems.filter(item =>
      isNavigationItemVisible(item, auth)
    ),
    visiblePageNavItems: navigationItems.filter(item =>
      isNavigationItemVisible(item, auth)
    ),
    settingsNavigationItem,
    showSettingsNavigationItem: isNavigationItemVisible(
      settingsNavigationItem,
      auth
    ),
  };
};
