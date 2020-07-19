import React, { useEffect, useRef, useState, RefObject } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect, MapStateToProps } from 'react-redux';
import { Box, Divider, Flex, Heading, Text } from '@chakra-ui/core';
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
    isActiveRoute,
    linkTo,
    text,
  }: {
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
        padding="0 12px 5px"
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
          <NavLink isActiveRoute={activeRoute === '/'} linkTo="/" text="Home" />
          <NavLink isActiveRoute={activeRoute === '/calendar'} linkTo="/calendar" text="Calendar" />
        </Box>

        <Box display={{ xs: isOpen ? 'block' : 'none', md: 'block' }} mt={{ base: 4, md: 0 }}>
          {isLoggedIn ? (
            <>
              <LogoutButton closeHeader={closeHeader} />
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
