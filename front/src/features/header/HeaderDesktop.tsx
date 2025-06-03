import { Flex, Separator } from '@chakra-ui/react';
import { useLocation } from 'wouter';

import Logo from './Logo';
import NavigationLinks from './NavigationLinks';
import RightSectionDesktop from './RightSectionDesktop';

const HeaderDesktop = () => {
  const [location] = useLocation();
  const isShowPage = location.includes('/show/');

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

      {!isShowPage && <Separator size="md" />}
    </>
  );
};

export default HeaderDesktop;
