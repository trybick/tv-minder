import { Button, Flex, Image, Link } from '@chakra-ui/react';
import { type MouseEvent } from 'react';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import logo from '~/assets/images/logo.svg';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppDispatch } from '~/store';
import { setShouldResetSearchInput } from '~/store/rtk/slices/searchInput.slice';
import { applyViewTransition } from '~/utils/viewTransition';

interface Props {
  onClose?: () => void;
}

export const Logo = ({ onClose }: Props) => {
  const { isMobile } = useResponsiveLayout();
  const dispatch = useAppDispatch();
  const [location, navigate] = useLocation();

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose?.();
    if (location === ROUTES.HOME) {
      applyViewTransition(() => dispatch(setShouldResetSearchInput(true)));
    } else {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <Flex as="h1" flex="1">
      <Link href={ROUTES.HOME} onClick={handleLogoClick}>
        <Button variant="plain" p="0">
          <Image
            alt="TV Minder logo"
            display="inline"
            h={isMobile ? '18px' : '24px'}
            src={logo}
            verticalAlign="middle"
          />
        </Button>
      </Link>
    </Flex>
  );
};
