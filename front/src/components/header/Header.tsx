import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect, MapStateToProps } from 'react-redux';
import {
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
} from '@chakra-ui/core';
import { FaUser } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { selectIsLoggedIn } from 'store/user/selectors';
import { setIsLoggedOutAction } from 'store/user/actions';
import LoginButton from './subcomponents/LoginButton';
import SignUpButton from './subcomponents/SignUpButton';
import LogoutButton from './subcomponents/LogoutButton';
import ToggleColorModeButton from './subcomponents/ToggleColorModeButton';
import logo from 'images/logo.svg';

interface StateProps {
  isLoggedIn: boolean;
}

interface DispatchProps {
  setIsLoggedOut: AppThunkPlainAction;
}

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

const Header = ({ isLoggedIn, setIsLoggedOut }: Props) => {
  const wrapperRef = useRef(null);
  const { isOpen, closeHeader, toggleIsOpen } = useHeaderManager(wrapperRef);
  const activeRoute = useLocation().pathname;
  const { colorMode } = useColorMode();

  const onLogout = () => {
    localStorage.removeItem('jwt');
    closeHeader();
    setIsLoggedOut();
  };

  const NavLink = ({
    isActiveRoute,
    linkTo,
    mobileWidth,
    text,
  }: {
    isActiveRoute?: boolean;
    linkTo: string;
    mobileWidth: string;
    text: string;
  }) => (
    <Link onClick={closeHeader} to={linkTo}>
      <Text
        borderColor={isActiveRoute ? `mode.${colorMode}.secondary` : ''}
        color={isActiveRoute ? `mode.${colorMode}.secondary` : `mode.${colorMode}.primary`}
        cursor="pointer"
        display="block"
        fontSize="1.2rem"
        fontWeight={isActiveRoute ? '600' : '500'}
        mr={1}
        mt={{ base: 4, md: 0 }}
        p={{ base: 0, md: '0 12px 5px' }}
        width={{ base: mobileWidth, md: 'unset' }}
      >
        {text}
      </Text>
    </Link>
  );

  return (
    <>
      <Flex
        align="center"
        as="nav"
        justify="space-between"
        p="10px 1.6rem 5px"
        ref={wrapperRef}
        wrap="wrap"
      >
        <Flex align="center">
          <Link onClick={closeHeader} to="/">
            <Image display="inline" height="35px" src={logo} />
          </Link>
        </Flex>

        <Box display={{ sm: 'block', md: 'none' }} onClick={toggleIsOpen}>
          <svg fill="teal" viewBox="0 0 20 20" width="12px" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </Box>

        <Box
          display={{ xs: isOpen ? 'block' : 'none', md: 'flex' }}
          mr="auto"
          pl="10px"
          pt="10px"
          width={{ xs: 'full', md: 'auto' }}
        >
          <NavLink isActiveRoute={activeRoute === '/'} linkTo="/" mobileWidth="48px" text="Home" />
          <NavLink
            isActiveRoute={activeRoute === '/calendar'}
            linkTo="/calendar"
            mobileWidth="70px"
            text="Calendar"
          />
          <NavLink
            isActiveRoute={activeRoute === '/my-shows'}
            linkTo="/my-shows"
            mobileWidth="84px"
            text="My Shows"
          />
        </Box>

        <Box display={{ xs: isOpen ? 'block' : 'none', md: 'flex' }} mt={{ base: 4, md: 0 }}>
          {isLoggedIn ? (
            <>
              <Box display={{ xs: 'none', md: 'flex' }}>
                <Menu>
                  <MenuButton mr="12px">
                    <Box as={IoMdNotifications} size="21px" />
                  </MenuButton>
                  <MenuList placement="bottom-end">
                    <MenuGroup title="Notifications">
                      <MenuItem>None</MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton>
                    <Box as={FaUser} size="18px" />
                  </MenuButton>
                  <MenuList placement="bottom-end">
                    <MenuGroup title="Options">
                      <MenuItem onClick={onLogout}>Logout</MenuItem>
                    </MenuGroup>
                  </MenuList>
                  <ToggleColorModeButton />
                </Menu>
              </Box>

              <Box display={{ xs: 'block', md: 'none' }}>
                <LogoutButton closeHeader={closeHeader} />
                <ToggleColorModeButton />
              </Box>
            </>
          ) : (
            <>
              <SignUpButton closeHeader={closeHeader} />
              <LoginButton closeHeader={closeHeader} />
              <ToggleColorModeButton />
            </>
          )}
        </Box>
      </Flex>

      <Divider />
    </>
  );
};

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (
  state: AppState
): StateProps => ({
  isLoggedIn: selectIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  setIsLoggedOut: () => dispatch(setIsLoggedOutAction()),
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(Header);
