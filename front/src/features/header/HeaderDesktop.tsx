import { Flex, Separator } from '@chakra-ui/react';
import { useLocation } from 'wouter';

import Logo from './Logo';
import NavigationLinks from './NavigationLinks';
import RightSection from './RightSection';

const HeaderDesktop = () => {
  const [location] = useLocation();
  const isShowPage = location.includes('/show/');

  return (
    <>
      <Flex as="nav" p="17px 1.6rem 15px">
        <Logo />
        <NavigationLinks />
        <RightSection />
      </Flex>

      {!isShowPage && <Separator size="md" />}
    </>
  );
};

export default HeaderDesktop;
