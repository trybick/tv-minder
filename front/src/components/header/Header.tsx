import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Heading, Text } from '@chakra-ui/core';
import LoginButton from './subcomponents/LoginButton';
import SignUpButton from './subcomponents/SignUpButton';
import LogoutButton from './subcomponents/LogoutButton';
import { isLoggedIn } from 'utils/localStorage';

const MenuItem = ({ text, linkTo }: { text: string; linkTo: string }) => (
  <Link to={linkTo}>
    <Text cursor="pointer" mt={{ base: 4, md: 0 }} mr={6} display="block">
      {text}
    </Text>
  </Link>
);

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Flex
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
        {isLoggedIn() ? (
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

export default Header;
