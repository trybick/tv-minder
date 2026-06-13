import { Flex } from '@chakra-ui/react';

import { ROUTES } from '~/app/routes';
import { useNavigationConfig } from '~/hooks/useNavigationConfig';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppDispatch } from '~/store';
import { setShouldResetSearchInput } from '~/store/rtk/slices/searchInput.slice';

import { LogoutButton } from './LogoutButton';
import { NavLink } from './NavLink';

interface Props {
  onClose?: () => void;
}

export const NavigationLinks = ({ onClose }: Props) => {
  const {
    isLoggedIn,
    settingsNavigationItem,
    showSettingsNavigationItem,
    visibleMainNavItems,
  } = useNavigationConfig();
  const { isMobile, isCompactDesktop } = useResponsiveLayout();
  const dispatch = useAppDispatch();

  return (
    <Flex
      flex="1"
      justifyContent="center"
      gap={1}
      {...(isMobile && {
        flexDirection: 'column',
        alignItems: 'flex-end',
      })}
    >
      {visibleMainNavItems.map(item => (
        <NavLink
          key={item.id}
          linkTo={item.route}
          text={item.label}
          icon={item.icon}
          onClose={onClose}
          onClick={
            item.route === ROUTES.HOME
              ? () => dispatch(setShouldResetSearchInput(true))
              : undefined
          }
          iconOnly={isCompactDesktop}
        />
      ))}

      {isMobile && showSettingsNavigationItem ? (
        <NavLink
          linkTo={settingsNavigationItem.route}
          text={settingsNavigationItem.label}
          icon={settingsNavigationItem.icon}
          onClose={onClose}
        />
      ) : null}

      {isMobile && isLoggedIn ? (
        <Flex justify="flex-end" mt="2">
          <LogoutButton />
        </Flex>
      ) : null}
    </Flex>
  );
};
