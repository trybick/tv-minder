import { Avatar, Box, defineStyle, Menu, Portal } from '@chakra-ui/react';
import { SlLogout } from 'react-icons/sl';
import { VscSettingsGear } from 'react-icons/vsc';

import { ROUTES } from '~/app/routes';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useAppSelector } from '~/store';
import { useAppDispatch } from '~/store';
import { setIsLoggedOutAction } from '~/store/user/actions';
import { selectIsGoogleUser, selectUserEmail } from '~/store/user/selectors';

const ringCss = defineStyle({
  outlineWidth: '1.5px',
  outlineColor: 'cyan.500',
  outlineOffset: '2px',
  outlineStyle: 'solid',
});

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigateWithAnimation();
  const email = useAppSelector(selectUserEmail);
  const isGoogleUser = useAppSelector(selectIsGoogleUser);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    dispatch(setIsLoggedOutAction());
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
          <Avatar.Root size="xs" css={ringCss}>
            <Avatar.Fallback name={email} />
            <Avatar.Image src="https://lh3.googleusercontent.com/a/ACg8ocIJ-6uFhxzZDICvy66efhNs82Cl2QGW5qXAS_Ev7FZI5o-upR00=s96-c" />
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

export default UserMenu;
