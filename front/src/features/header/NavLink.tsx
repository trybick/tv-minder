import { Button, Link } from '@chakra-ui/react';
import { MouseEvent } from 'react';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';

interface NavLinkProps {
  linkTo: string;
  text: string;
  onClose?: () => void;
}

const NavLink = ({ linkTo, text, onClose }: NavLinkProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigateWithAnimation();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose?.();
    navigate(linkTo);
  };

  return (
    <Link href={linkTo} onClick={handleClick}>
      <Button
        _hover={{
          textDecoration: 'underline',
          textUnderlineOffset: '5px',
          textDecorationThickness: '2px',
        }}
        color="cyan.500"
        fontSize="1.2rem"
        fontWeight="600"
        mr={isMobile ? '-16px' : 0}
        p="16px"
        variant="plain"
      >
        {text}
      </Button>
    </Link>
  );
};

export default NavLink;
