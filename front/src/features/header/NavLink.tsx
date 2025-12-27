import { Button, Link } from '@chakra-ui/react';
import { MouseEvent } from 'react';

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

  return (
    <Link href={linkTo} onClick={handleClick}>
      <Button
        color="cyan.500"
        fontSize="1.2rem"
        fontWeight="600"
        p="16px"
        variant="plain"
        _hover={{
          textDecoration: 'underline',
          textUnderlineOffset: '5px',
          textDecorationThickness: '2px',
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
