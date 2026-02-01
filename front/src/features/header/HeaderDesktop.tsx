import { Flex, Separator } from '@chakra-ui/react';

import { Logo } from './Logo';
import { NavigationLinks } from './NavLinksContainer';
import { RightSectionDesktop } from './RightSectionDesktop';

export const HeaderDesktop = () => {
  return (
    <>
      <Flex
        align="center"
        as="nav"
        justify="space-between"
        p="10px 1.6rem"
      >
        <Logo />
        <NavigationLinks />
        <RightSectionDesktop />
      </Flex>

      <Separator size="md" />
    </>
  );
};
