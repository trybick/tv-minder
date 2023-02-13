import { RefObject, useEffect, useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { connect, MapStateToProps } from 'react-redux';
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { selectIsLoggedIn, selectUserEmail } from 'store/user/selectors';
import { setIsLoggedOutAction } from 'store/user/actions';
import { useIsMobile } from 'hooks/useIsMobile';
import { ROUTES } from 'constants/routes';
import logo from 'images/logo.svg';
import LoginButton from './subcomponents/LoginButton';
import SignUpButton from './subcomponents/SignUpButton';
import LogoutButton from './subcomponents/LogoutButton';
import ToggleColorModeButton from './subcomponents/ToggleColorModeButton';

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
  const activeRoute = useLocation().pathname;
  const { colorMode } = useColorMode();
  const isMobile = useIsMobile();
  const history = useHistory();
  const avatarBackgroundColor = useColorModeValue('#a0afbf', 'black');

  const onLogout = () => {
    localStorage.removeItem('jwt');
    closeHeader();
    setIsLoggedOut();
  };

  const NavLink = ({ linkTo, text }: { linkTo: string; text: string }) => {
    const isActive = activeRoute === linkTo;
    return (
      <Link onClick={closeHeader} to={linkTo}>
        <Text
          borderColor={isActive ? `mode.${colorMode}.secondary` : ''}
          color={isActive ? `mode.${colorMode}.secondary` : `mode.${colorMode}.primary`}
          cursor="pointer"
          display="block"
          fontSize="1.2rem"
          fontWeight={isActive ? '600' : '500'}
          mr={1}
          mt={{ base: 4, md: 0 }}
          p={{ base: 0, md: '0 12px 5px' }}
        >
          {text}
        </Text>
      </Link>
    );
  };

  return (
    <>
      <Flex
        align="center"
        as="nav"
        justify="space-between"
        p="14px 1.6rem 7px"
        ref={wrapperRef}
        wrap="wrap"
      >
        <Flex align="center" as="h1">
          <Link onClick={closeHeader} to={ROUTES.HOME}>
            <Image
              alt="TV Minder logo"
              display="inline"
              h="28px"
              src={logo}
              verticalAlign="middle"
              w="173px"
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
          pl="10px"
          pt="10px"
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
          <NavLink linkTo={ROUTES.HOME} text="Search" />
          <NavLink linkTo={ROUTES.CALENDAR} text="Calendar" />
          <NavLink linkTo={ROUTES.MY_SHOWS} text="My Shows" />
          {isLoggedIn ? (
            <Box display={{ base: 'block', md: 'none' }}>
              <NavLink linkTo={ROUTES.SETTINGS} text="Settings" />
            </Box>
          ) : null}
        </Box>

        <Box
          display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
          mt={{ base: 4, md: 0 }}
          textAlign={{ base: isOpen && isLoggedIn ? 'right' : 'left', md: 'left' }}
          w={{ base: 'full', md: 'auto' }}
        >
          {isLoggedIn ? (
            <>
              <Box display={{ base: 'none', md: 'flex' }}>
                <ToggleColorModeButton />
                <Menu placement="bottom-end">
                  <MenuButton aria-label="Page Options" ml="12px">
                    <Avatar bg={avatarBackgroundColor} size="sm" />
                  </MenuButton>
                  <MenuList zIndex={4}>
                    <MenuGroup title={email}>
                      <MenuItem onClick={() => history.push(ROUTES.SETTINGS)}>Settings</MenuItem>
                      <MenuItem onClick={onLogout}>Logout</MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu>
              </Box>

              <Box display={{ base: 'block', md: 'none' }}>
                <LogoutButton closeHeader={closeHeader} />
                <ToggleColorModeButton />
              </Box>
            </>
          ) : (
            <Flex justify="flex-end">
              <ToggleColorModeButton mr="14px" />
              <LoginButton closeHeader={closeHeader} />
              <SignUpButton closeHeader={closeHeader} />
            </Flex>
          )}
        </Box>
      </Flex>

      <Divider mt="6px" />
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
