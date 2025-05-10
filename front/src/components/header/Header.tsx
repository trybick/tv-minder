import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Menu,
  Portal,
  Separator,
} from '@chakra-ui/react';
import { RefObject, useEffect, useRef, useState } from 'react';
import { SlLogout } from 'react-icons/sl';
import { VscSettingsGear } from 'react-icons/vsc';
import { Link as RouterLink, useLocation } from 'wouter';

import { setShouldResetSearchInput } from '~/components/search/searchInputSlice';
import { ColorModeButton, useColorMode } from '~/components/ui/color-mode';
import { ROUTES } from '~/constants/routes';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import logo from '~/images/logo.svg';
import { useAppDispatch, useAppSelector } from '~/store';
import { setIsLoggedOutAction } from '~/store/user/actions';
import {
  selectIsGoogleUser,
  selectIsLoggedIn,
  selectUserEmail,
} from '~/store/user/selectors';

import LoginButton from './subcomponents/LoginButton';
import LogoutButton from './subcomponents/LogoutButton';
import SignUpButton from './subcomponents/SignUpButton';

// On smaller resolutions a hamburger menu is shown which opens the header
// This hook manages the 'open' state and closes the menu upon clicking outside
function useHeaderManager(ref: RefObject<HTMLDivElement | null>) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const closeHeader = () => setIsOpen(false);

  useEffect(() => {
    function closeHeaderOnOutsideClick(event: Event) {
      const isClickOutside =
        ref.current && !ref.current.contains(event.target as Node);
      if (isClickOutside && isOpen) {
        closeHeader();
      }
    }
    document.addEventListener('mousedown', closeHeaderOnOutsideClick);
    return () => {
      document.removeEventListener('mousedown', closeHeaderOnOutsideClick);
    };
  }, [isOpen, ref]);

  return { isOpen, closeHeader, toggleIsOpen };
}

const Header = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const { toggleColorMode } = useColorMode();
  const [location] = useLocation();
  const navigate = useNavigateWithAnimation();
  const isShowPage = location.includes('/show/');

  const containerRef = useRef(null);
  const { isOpen, closeHeader, toggleIsOpen } = useHeaderManager(containerRef);

  const email = useAppSelector(selectUserEmail);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isGoogleUser = useAppSelector(selectIsGoogleUser);

  const onLogout = () => {
    localStorage.removeItem('jwt');
    closeHeader();
    dispatch(setIsLoggedOutAction());
  };

  const NavLink = ({ linkTo, text }: { linkTo: string; text: string }) => (
    <Button
      _hover={{
        textDecoration: 'underline',
        textUnderlineOffset: '5px',
        textDecorationThickness: '2px',
      }}
      color="cyan.500"
      fontSize="1.2rem"
      fontWeight="600"
      mr={isMobile ? '-16px' : 0}
      onClick={() => {
        closeHeader();
        navigate(linkTo);
      }}
      p="16px"
      variant="plain"
    >
      {text}
    </Button>
  );

  const onLogoClick = () => {
    closeHeader();
    dispatch(setShouldResetSearchInput(true));
  };

  return (
    <>
      <Flex
        align="center"
        as="nav"
        justify="space-between"
        p={isMobile ? '17px 1.6rem 9px' : '15px 1.6rem 9px'}
        ref={containerRef}
        wrap="wrap"
      >
        <Flex align="center" as="h1" m={{ base: '0 auto', md: 'unset' }}>
          <RouterLink href={ROUTES.HOME} onClick={onLogoClick}>
            <Image
              alt="TV Minder logo"
              display="inline"
              h="30px"
              mt={isMobile ? '' : '6px'}
              src={logo}
              verticalAlign="middle"
            />
          </RouterLink>
        </Flex>

        <Box
          cursor="pointer"
          display={{ base: 'block', md: 'none' }}
          onClick={toggleIsOpen}
        >
          <svg
            fill="teal"
            viewBox="0 0 20 20"
            width="17px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </Box>

        <Box
          display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
          gap="10px"
          pt="6px"
          w={{ base: 'full', md: 'auto' }}
          {...(isOpen &&
            isMobile && {
              alignItems: 'flex-end',
              display: 'flex',
              flexDir: 'column',
              ml: 'auto',
              mr: 'unset',
            })}
        >
          <NavLink linkTo={ROUTES.HOME} text="Discover" />
          <NavLink linkTo={ROUTES.CALENDAR} text="Calendar" />
          {isLoggedIn && <NavLink linkTo={ROUTES.MANAGE} text="Manage" />}

          {isLoggedIn && !isGoogleUser ? (
            <Box display={{ base: 'block', md: 'none' }}>
              <NavLink linkTo={ROUTES.SETTINGS} text="Settings" />
            </Box>
          ) : null}
        </Box>

        <Box
          display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
          justifyContent={{ base: 'flex-start', md: 'flex-end' }}
          mt={{ base: 4, md: 0 }}
          textAlign={{
            base: isOpen && isLoggedIn ? 'right' : 'left',
            md: 'left',
          }}
          // Setting the width of this div to 186px matches the width of the TV Minder Logo image
          // which allows the Nav Links to be in the center of the screen
          w={{ base: 'full', md: '186px' }}
        >
          {isLoggedIn ? (
            <>
              <Box display={{ base: 'none', md: 'flex' }}>
                <ColorModeButton mr="8px" />
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
                        {!isGoogleUser && (
                          <Menu.Item
                            cursor="pointer"
                            onClick={() => navigate(ROUTES.SETTINGS)}
                            p="10px"
                            value="settings"
                          >
                            <VscSettingsGear />
                            Settings
                          </Menu.Item>
                        )}
                        <Menu.Item
                          cursor="pointer"
                          onClick={onLogout}
                          p="10px"
                          value="logout"
                        >
                          <SlLogout />
                          Logout
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Box>

              <Box display={{ base: 'block', md: 'none' }}>
                <ColorModeButton
                  mr="12px"
                  onClick={() => {
                    closeHeader();
                    toggleColorMode();
                  }}
                />
                <LogoutButton closeHeader={closeHeader} />
              </Box>
            </>
          ) : (
            <Flex alignItems="center" gap="10px" justify="flex-end">
              <ColorModeButton
                onClick={() => {
                  closeHeader();
                  toggleColorMode();
                }}
              />
              <SignUpButton />
              <LoginButton />
            </Flex>
          )}
        </Box>
      </Flex>

      {(!isMobile || (isMobile && !isShowPage)) && (
        <Separator mt="6px" size="md" />
      )}
    </>
  );
};

export default Header;
