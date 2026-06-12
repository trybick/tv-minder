import { Box, Flex } from '@chakra-ui/react';

import { Logo } from './Logo';
import { NavigationLinks } from './NavLinksContainer';
import { RightSectionDesktop } from './RightSectionDesktop';

export const HeaderDesktop = () => {
  return (
    <Box
      position="sticky"
      top="0"
      zIndex="banner"
      bg="bg.muted/75"
      backdropFilter="blur(12px)"
      borderBottomWidth="1px"
      borderColor="whiteAlpha.100"
    >
      <Flex align="center" as="nav" justify="space-between" px="6" py="2.5">
        <Logo />
        <NavigationLinks />
        <RightSectionDesktop />
      </Flex>
    </Box>
  );
};
