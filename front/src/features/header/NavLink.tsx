import { Button, Link } from '@chakra-ui/react';
import { MouseEvent } from 'react';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';

interface Props {
  linkTo: string;
  text: string;
  onClose?: () => void;
  onClick?: () => void;
}

const NavLink = ({ linkTo, text, onClose, onClick }: Props) => {
  const isMobile = useIsMobile();
  const navigate = useNavigateWithAnimation();
  const [location] = useLocation();
  const isActive = location === linkTo;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose?.();
    onClick?.();
    if (linkTo === ROUTES.MANAGE) {
      navigate(linkTo, { skipImageTransition: true });
    } else {
      navigate(linkTo);
    }
  };

  const textDecorationProps = {
    textDecoration: isActive ? 'underline' : 'none',
    textDecorationColor: 'cyan.400',
    textDecorationThickness: '1px',
    textUnderlineOffset: '6px',
  };

  return (
    <Link href={linkTo} onClick={handleClick}>
      <Button
        color={isActive ? 'cyan.400' : 'gray.400'}
        {...textDecorationProps}
        fontSize="1.2rem"
        fontWeight="700"
        p="16px"
        variant="plain"
        _hover={{
          color: 'cyan.400',
          ...textDecorationProps,
          textDecoration: 'underline',
        }}
        {...(isMobile && {
          mr: '-16px',
        })}
      >
        {text}
      </Button>
    </Link>
  );
};

export default NavLink;
