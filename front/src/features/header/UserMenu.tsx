import { Avatar, Box, Menu, Portal } from '@chakra-ui/react';
import { SlLogout } from 'react-icons/sl';
import { VscSettingsGear } from 'react-icons/vsc';

import { ROUTES } from '~/app/routes';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  selectEmail,
  selectIsGoogleUser,
  setIsLoggedOut,
} from '~/store/rtk/slices/user.slice';

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigateWithAnimation();
  const email = useAppSelector(selectEmail);
  const isGoogleUser = useAppSelector(selectIsGoogleUser);

  const handleLogout = () => {
    dispatch(setIsLoggedOut());
  };

  return (
    <Box>
      <Menu.Root
        // @ts-ignore - colorPalette is a valid prop for the Menu.Root component
        colorPalette="customCyan"
        positioning={{ placement: 'bottom-end' }}
      >
        <Menu.Trigger
          aria-label="Page Options"
          cursor="pointer"
          focusRing="none"
        >
          <Avatar.Root size="sm">
            <Avatar.Fallback name={email} />
          </Avatar.Root>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content zIndex={4}>
              <Menu.ItemGroup>
                <Menu.Item
                  cursor="default"
                  value="email"
                  _hover={{ bg: 'transparent' }}
                  color="fg"
                  opacity={0.7}
                >
                  {email}
                </Menu.Item>
              </Menu.ItemGroup>

              <Menu.Separator />

              <Menu.ItemGroup>
                {!isGoogleUser && (
                  <Menu.Item
                    cursor="pointer"
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    p="8px 8px"
                    value="settings"
                    color="gray.200"
                  >
                    <VscSettingsGear />
                    Settings
                  </Menu.Item>
                )}
                <Menu.Item
                  cursor="pointer"
                  onClick={handleLogout}
                  p="8px 8px"
                  value="logout"
                  color="red.500"
                >
                  <SlLogout />
                  Logout
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
};
