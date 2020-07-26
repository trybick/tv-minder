import React, { useEffect, useRef, useState, RefObject } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect, MapStateToProps } from 'react-redux';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  MenuOptionGroup,
  MenuItemOption,
  Text,
} from '@chakra-ui/core';
import { FaUser } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { AppState } from 'store';
import { selectIsLoggedIn } from 'store/user/reducers';
import LoginButton from './subcomponents/LoginButton';
import SignUpButton from './subcomponents/SignUpButton';
import LogoutButton from './subcomponents/LogoutButton';

interface StateProps {
  isLoggedIn: boolean;
}

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

const Header = ({ isLoggedIn }: StateProps) => {
  const wrapperRef = useRef(null);
  const { isOpen, closeHeader, toggleIsOpen } = useHeaderManager(wrapperRef);
  const activeRoute = useLocation().pathname;

  const NavLink = ({
    borderWidth,
    isActiveRoute,
    linkTo,
    text,
  }: {
    borderWidth: string;
    isActiveRoute?: boolean;
    linkTo: string;
    text: string;
  }) => (
    <Link onClick={closeHeader} to={linkTo}>
      <Text
        borderBottom={isActiveRoute ? '3px solid teal' : ''}
        color={isActiveRoute ? 'teal.600' : ''}
        cursor="pointer"
        display="block"
        fontSize="1.05rem"
        mr={6}
        mt={{ base: 4, md: 0 }}
        padding={{ base: 0, md: '0 12px 5px' }}
        width={{ base: borderWidth, md: 'unset' }}
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
        bg="white"
        color="black"
        justify="space-between"
        padding="1.2rem 1.2rem 0"
        ref={wrapperRef}
        wrap="wrap"
      >
        <Flex align="center" mr={5}>
          <Link onClick={closeHeader} to="/">
            <Heading
              as="h1"
              cursor="pointer"
              display="inline"
              fontSize="1rem"
              fontWeight="600"
              size="md"
            >
              TV Minder
            </Heading>
          </Link>
        </Flex>

        <Box display={{ sm: 'block', md: 'none' }} onClick={toggleIsOpen}>
          <svg fill="teal" width="12px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </Box>

        <Box
          display={{ xs: isOpen ? 'block' : 'none', md: 'flex' }}
          width={{ xs: 'full', md: 'auto' }}
          ml="auto"
          mr="auto"
        >
          <NavLink borderWidth="48px" isActiveRoute={activeRoute === '/'} linkTo="/" text="Home" />
          <NavLink
            borderWidth="70px"
            isActiveRoute={activeRoute === '/calendar'}
            linkTo="/calendar"
            text="Calendar"
          />
        </Box>

        <Box display={{ xs: isOpen ? 'block' : 'none', md: 'flex' }} mt={{ base: 4, md: 0 }}>
          {isLoggedIn ? (
            <>
              <Box display={{ xs: 'none', md: 'flex' }}>
                {/* <Box as={IoMdNotifications} color="black" display="block" size="19px" /> */}

                <Menu>
                  <MenuButton>
                    <Box as={FaUser} size="19px" />
                  </MenuButton>
                  <MenuList placement="bottom-start">
                    <MenuGroup title="Options">
                      <MenuItem>My Profile</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup>
                      <MenuItem>Logout</MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu>
              </Box>

              <Box display={{ xs: 'block', md: 'none' }}>
                <LogoutButton closeHeader={closeHeader} />
              </Box>
            </>
          ) : (
            <>
              <SignUpButton closeHeader={closeHeader} />
              <LoginButton closeHeader={closeHeader} />
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

export default connect<StateProps, {}, {}, AppState>(mapStateToProps, {})(Header);
