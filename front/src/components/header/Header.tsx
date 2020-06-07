import React, { useEffect, useRef, useState, RefObject } from 'react';
import { Link } from 'react-router-dom';
import { connect, MapStateToProps } from 'react-redux';
import { Box, Flex, Heading, Text } from '@chakra-ui/core';
import { AppState } from 'store';
import { selectIsLoggedIn } from 'store/user/reducers';
import LoginButton from './subcomponents/LoginButton';
import SignUpButton from './subcomponents/SignUpButton';
import LogoutButton from './subcomponents/LogoutButton';

interface StateProps {
  isLoggedIn: boolean;
}

const MenuItem = ({ text, linkTo }: { text: string; linkTo: string }) => (
  <Link to={linkTo}>
    <Text cursor="pointer" mt={{ base: 4, md: 0 }} mr={6} display="block">
      {text}
    </Text>
  </Link>
);

// Mange header 'open' state and close hamburger menu when user clicks outside header
function useHeaderManager(ref: RefObject<HTMLDivElement>) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    function closeHeaderOnOutsideClick(event: Event) {
      const isClickOutside = ref.current && !ref.current.contains(event.target as Node);
      if (isClickOutside && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', closeHeaderOnOutsideClick);

    return () => {
      document.removeEventListener('mousedown', closeHeaderOnOutsideClick);
    };
  }, [isOpen, ref]);

  return { handleToggle, isOpen };
}

const Header = ({ isLoggedIn }: StateProps) => {
  const wrapperRef = useRef(null);
  const { handleToggle, isOpen } = useHeaderManager(wrapperRef);

  return (
    <Flex
      ref={wrapperRef}
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="teal.500"
      color="white"
    >
      <Flex align="center" mr={5}>
        <Link to="/">
          <Heading cursor="pointer" as="h1" size="lg" letterSpacing={'-.1rem'}>
            TV Minder
          </Heading>
        </Link>
      </Flex>

      <Box display={{ sm: 'block', md: 'none' }} onClick={handleToggle}>
        <svg fill="white" width="12px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={{ xs: isOpen ? 'block' : 'none', md: 'flex' }}
        width={{ xs: 'full', md: 'auto' }}
        alignItems="center"
        flexGrow={1}
      >
        <MenuItem text="Search" linkTo="/" />
        <MenuItem text="Calendar" linkTo="/calendar" />
      </Box>

      <Box display={{ xs: isOpen ? 'block' : 'none', md: 'block' }} mt={{ base: 4, md: 0 }}>
        {isLoggedIn ? (
          <>
            <LogoutButton />
          </>
        ) : (
          <>
            <LoginButton />
            <SignUpButton />
          </>
        )}
      </Box>
    </Flex>
  );
};

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (
  state: AppState
): StateProps => ({
  isLoggedIn: selectIsLoggedIn(state),
});

export default connect<StateProps, {}, {}, AppState>(mapStateToProps, {})(Header);
