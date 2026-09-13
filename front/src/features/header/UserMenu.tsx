import { Avatar, Box, Menu, Portal, Text } from '@chakra-ui/react';
import { LuLogOut, LuSettings } from 'react-icons/lu';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import { useNavigationConfig } from '~/hooks/useNavigationConfig';
import { useAppDispatch, useAppSelector } from '~/store';
import { selectEmail, setIsLoggedOut } from '~/store/rtk/slices/user.slice';

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const email = useAppSelector(selectEmail);
  const { showSettingsNavigationItem } = useNavigationConfig();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    dispatch(setIsLoggedOut());
  };

  return (
    <Box ml={0.5}>
      <Menu.Root positioning={{ placement: 'bottom-end', gutter: 8 }}>
        <Menu.Trigger
          aria-label="User menu"
          cursor="pointer"
          rounded="full"
          transition="box-shadow 150ms"
          _hover={{ boxShadow: '0 0 0 2px var(--chakra-colors-cyan-500)' }}
          _focusVisible={{
            outline: 'none',
            boxShadow: '0 0 0 2px var(--chakra-colors-cyan-500)',
          }}
        >
          <Avatar.Root size="xs" colorPalette="cyan">
            <Avatar.Fallback name={email} />
          </Avatar.Root>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content minW="220px" zIndex={4} p="1.5">
              <Box px="3" py="2.5">
                <Text fontSize="xs" color="fg.muted" fontWeight="medium">
                  Signed in as
                </Text>
                <Text fontSize="sm" color="fg" fontWeight="semibold" truncate>
                  {email}
                </Text>
              </Box>

              <Menu.Separator borderColor="whiteAlpha.100" />

              <Menu.ItemGroup py="1">
                {showSettingsNavigationItem ? (
                  <Menu.Item
                    cursor="pointer"
                    rounded="lg"
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate(ROUTES.SETTINGS);
                    }}
                    value="settings"
                  >
                    <LuSettings />
                    Settings
                  </Menu.Item>
                ) : null}
                <Menu.Item
                  cursor="pointer"
                  rounded="lg"
                  onClick={handleLogout}
                  value="logout"
                  color="red.400"
                  _hover={{ bg: 'red.950', color: 'red.300' }}
                >
                  <LuLogOut />
                  Log out
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
};
