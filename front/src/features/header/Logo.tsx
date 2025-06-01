import { Button, Flex, Image } from '@chakra-ui/react';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import logo from '~/assets/images/logo.svg';
import { setShouldResetSearchInput } from '~/features/search/searchInputSlice';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useAppDispatch } from '~/store';
import { applyViewTransition } from '~/utils/applyViewTransition';

interface LogoProps {
  onClose?: () => void;
}

const Logo = ({ onClose }: LogoProps) => {
  const dispatch = useAppDispatch();
  const [location] = useLocation();
  const navigate = useNavigateWithAnimation();

  const handleLogoClick = () => {
    onClose?.();
    if (location === ROUTES.HOME) {
      applyViewTransition(() => dispatch(setShouldResetSearchInput(true)));
    } else {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <Flex align="center" as="h1" flex="1">
      <Button variant="plain" onClick={handleLogoClick}>
        <Image
          alt="TV Minder logo"
          display="inline"
          h="30px"
          src={logo}
          verticalAlign="middle"
        />
      </Button>
    </Flex>
  );
};

export default Logo;
