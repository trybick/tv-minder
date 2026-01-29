import { Flex } from '@chakra-ui/react';
import { FiCalendar, FiCompass, FiList, FiSettings } from 'react-icons/fi';

import { ROUTES } from '~/app/routes';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppDispatch, useAppSelector } from '~/store';
import { setShouldResetSearchInput } from '~/store/rtk/slices/searchInput.slice';
import {
  selectIsGoogleUser,
  selectIsLoggedIn,
} from '~/store/rtk/slices/user.slice';

import { LogoutButton } from './LogoutButton';
import { NavLink } from './NavLink';

interface Props {
  onClose?: () => void;
}

export const NavigationLinks = ({ onClose }: Props) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isGoogleUser = useAppSelector(selectIsGoogleUser);
  const { isMobile, isCompactDesktop } = useResponsiveLayout();
  const dispatch = useAppDispatch();

  return (
    <Flex
      flex="1"
      justifyContent="center"
      gap={isCompactDesktop ? '4px' : '10px'}
      {...(isMobile && {
        flexDirection: 'column',
        alignItems: 'flex-end',
      })}
    >
      <NavLink
        linkTo={ROUTES.HOME}
        text="Discover"
        icon={FiCompass}
        onClose={onClose}
        onClick={() => dispatch(setShouldResetSearchInput(true))}
        iconOnly={isCompactDesktop}
      />
      <NavLink
        linkTo={ROUTES.CALENDAR}
        text="Calendar"
        icon={FiCalendar}
        onClose={onClose}
        iconOnly={isCompactDesktop}
      />

      {isLoggedIn && (
        <NavLink
          linkTo={ROUTES.MANAGE}
          text="Manage"
          icon={FiList}
          onClose={onClose}
          iconOnly={isCompactDesktop}
        />
      )}

      {isMobile && isLoggedIn && !isGoogleUser ? (
        <NavLink
          linkTo={ROUTES.SETTINGS}
          text="Settings"
          icon={FiSettings}
          onClose={onClose}
        />
      ) : null}

      {isMobile && isLoggedIn ? <LogoutButton /> : null}
    </Flex>
  );
};
