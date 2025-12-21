import { Button, Flex, Image, Link } from '@chakra-ui/react';
import { MouseEvent } from 'react';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import logo from '~/assets/images/logo.svg';
import { setShouldResetSearchInput } from '~/store/rtk/slices/searchInput.slice';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useAppDispatch } from '~/store';
import { applyViewTransition } from '~/utils/applyViewTransition';

interface Props {
  onClose?: () => void;
}

const Logo = ({ onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [location] = useLocation();
  const navigate = useNavigateWithAnimation();

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
            h="30px"
            src={logo}
            verticalAlign="middle"
          />
        </Button>
      </Link>
    </Flex>
  );
};

export default Logo;
