import { Flex, Separator } from '@chakra-ui/react';

import Logo from './Logo';
import NavigationLinks from './NavLinksContainer';
import RightSectionDesktop from './RightSectionDesktop';

const HeaderDesktop = () => {
  return (
    <>
      <Flex
        align="center"
        as="nav"
        justify="space-between"
        p="17px 1.6rem 15px"
      >
        <Logo />
        <NavigationLinks />
        <RightSectionDesktop />
      </Flex>

      <Separator size="md" />
    </>
  );
};

export default HeaderDesktop;
