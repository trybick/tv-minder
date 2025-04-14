import { RefObject, useEffect, useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { connect, MapStateToProps } from 'react-redux';
import { Avatar, Box, Button, Flex, Image, Menu, Portal, Separator } from '@chakra-ui/react';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { selectIsLoggedIn, selectUserEmail } from 'store/user/selectors';
import { setIsLoggedOutAction } from 'store/user/actions';
import { useIsMobile } from 'hooks/useIsMobile';
import { ROUTES } from 'constants/routes';
import logo from 'images/logo.svg';
import LoginButton from './subcomponents/LoginButton';
import SignUpButton from './subcomponents/SignUpButton';
import LogoutButton from './subcomponents/LogoutButton';
import { ColorModeButton } from 'components/ui/color-mode';
import { VscSettingsGear } from 'react-icons/vsc';
import { SlLogout } from 'react-icons/sl';

type StateProps = {
  email: string;
  isLoggedIn: boolean;
};

type DispatchProps = {
  setIsLoggedOut: AppThunkPlainAction;
};

type Props = StateProps & DispatchProps;

// On smaller resolutions a hamburger menu is shown which opens the header
// This hook manages the 'open' state and closes the menu upon clicking outside
function useHeaderManager(ref: RefObject<HTMLDivElement>) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const closeHeader = () => setIsOpen(false);

  useEffect(() => {
    function closeHeaderOnOutsideClick(event: Event) {
      const isClickOutside = ref.current && !ref.current.contains(event.target as Node);
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

const Header = ({ email, isLoggedIn, setIsLoggedOut }: Props) => {
  const wrapperRef = useRef(null);
  const { isOpen, closeHeader, toggleIsOpen } = useHeaderManager(wrapperRef);
  const isMobile = useIsMobile();
  const history = useHistory();
  const location = useLocation();
  const isShowPage = location.pathname.includes('/show/');

  const onLogout = () => {
    localStorage.removeItem('jwt');
    closeHeader();
    setIsLoggedOut();
  };

  const NavLink = ({ linkTo, text }: { linkTo: string; text: string }) => (
    <Button
      _hover={{
        textDecoration: 'underline',
        textUnderlineOffset: '2px',
      }}
      as={Link}
      color="primary"
      colorPalette="blue"
      fontSize="1.2rem"
      fontWeight="600"
      mr={isMobile ? '-16px' : 0}
      onClick={closeHeader}
      p={isMobile ? '16px ' : '16px'}
      to={linkTo}
      variant="plain"
    >
      {text}
    </Button>
  );

  return (
    <>
      <Flex
        align="center"
        as="nav"
        justify="space-between"
        p={isMobile ? '17px 1.6rem 9px' : '15px 1.6rem 9px'}
        ref={wrapperRef}
        wrap="wrap"
      >
        <Flex align="center" as="h1" m={{ base: '0 auto', md: 'unset' }}>
          <Link onClick={closeHeader} to={ROUTES.HOME}>
            <Image
              alt="TV Minder logo"
              display="inline"
              h="30px"
              mt={isMobile ? '' : '6px'}
              src={logo}
              verticalAlign="middle"
            />
          </Link>
        </Flex>

        <Box cursor="pointer" display={{ base: 'block', md: 'none' }} onClick={toggleIsOpen}>
          <svg fill="teal" viewBox="0 0 20 20" width="17px" xmlns="http://www.w3.org/2000/svg">
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
          {isLoggedIn && <NavLink linkTo={ROUTES.FOLLOWING} text="Manage" />}

          {isLoggedIn ? (
            <Box display={{ base: 'block', md: 'none' }}>
              <NavLink linkTo={ROUTES.SETTINGS} text="Settings" />
            </Box>
          ) : null}
        </Box>

        <Box
          display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
          justifyContent={{ base: 'flex-start', md: 'flex-end' }}
          mt={{ base: 4, md: 0 }}
          textAlign={{ base: isOpen && isLoggedIn ? 'right' : 'left', md: 'left' }}
          // Setting the width of this div to 186px matches the width of the TV Minder Logo image
          // which allows the Nav Links to be in the center of the screen
          w={{ base: 'full', md: '186px' }}
        >
          {isLoggedIn ? (
            <>
              <Box display={{ base: 'none', md: 'flex' }}>
                <ColorModeButton mr="8px" />
                <Menu.Root positioning={{ placement: 'bottom-end' }}>
                  <Menu.Trigger aria-label="Page Options" cursor="pointer">
                    <Avatar.Root size="sm">
                      <Avatar.Fallback />
                    </Avatar.Root>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content zIndex={4}>
                        <Menu.Item
                          cursor="pointer"
                          onClick={() => history.push(ROUTES.SETTINGS)}
                          p="10px"
                          value="settings"
                        >
                          <VscSettingsGear />
                          Settings
                        </Menu.Item>
                        <Menu.Item cursor="pointer" onClick={onLogout} p="10px" value="logout">
                          <SlLogout />
                          Logout
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Box>

              <Box display={{ base: 'block', md: 'none' }}>
                <ColorModeButton mr="8px" />
                <LogoutButton closeHeader={closeHeader} />
              </Box>
            </>
          ) : (
            <Flex alignItems="center" justify="flex-end">
              <ColorModeButton mr="8px" />
              <LoginButton closeHeader={closeHeader} />
              <SignUpButton closeHeader={closeHeader} />
            </Flex>
          )}
        </Box>
      </Flex>

      {(!isMobile || (isMobile && !isShowPage)) && <Separator mt="6px" />}
    </>
  );
};

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (
  state: AppState
): StateProps => ({
  email: selectUserEmail(state),
  isLoggedIn: selectIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  setIsLoggedOut: () => dispatch(setIsLoggedOutAction()),
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(Header);
