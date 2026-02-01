import { Avatar, Box, Menu, Portal, Text } from '@chakra-ui/react';
import { LuLogOut, LuSettings } from 'react-icons/lu';

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
    <Box ml={0.5}>
      <Menu.Root positioning={{ placement: 'bottom-end', gutter: 8 }}>
        <Menu.Trigger aria-label="User menu" cursor="pointer" rounded="full">
          <Avatar.Root size="xs">
            <Avatar.Fallback name={email} />
          </Avatar.Root>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content minW="200px" zIndex={4}>
              <Box px="3" py="2">
                <Text fontSize="xs" color="fg.muted" fontWeight="medium">
                  Signed in as
                </Text>
                <Text fontSize="sm" color="fg" fontWeight="semibold" truncate>
                  {email}
                </Text>
              </Box>

              <Menu.Separator />

              <Menu.ItemGroup>
                {!isGoogleUser && (
                  <Menu.Item
                    cursor="pointer"
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    value="settings"
                  >
                    <LuSettings />
                    Settings
                  </Menu.Item>
                )}
                <Menu.Item
                  cursor="pointer"
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
