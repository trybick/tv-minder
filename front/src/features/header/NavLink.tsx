import { Button, HStack, Icon, Link } from '@chakra-ui/react';
import { type MouseEvent } from 'react';
import type { IconType } from 'react-icons';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';

interface Props {
  linkTo: string;
  text: string;
  icon: IconType;
  onClose?: () => void;
  onClick?: () => void;
  iconOnly?: boolean;
}

export const NavLink = ({
  linkTo,
  text,
  icon,
  onClose,
  onClick,
  iconOnly,
}: Props) => {
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

  const textDecorationProps = iconOnly
    ? {}
    : {
        textDecoration: isActive ? 'underline' : 'none',
        textDecorationColor: 'cyan.400',
        textDecorationThickness: '1px',
        textUnderlineOffset: '6px',
      };

  return (
    <Link
      href={linkTo}
      onClick={handleClick}
      title={iconOnly ? text : undefined}
    >
      <Button
        color={isActive ? 'cyan.500' : 'gray.500'}
        {...textDecorationProps}
        fontSize="1.2rem"
        fontWeight="700"
        p={iconOnly ? '10px' : '16px'}
        minW={iconOnly ? 'auto' : undefined}
        variant="plain"
        _hover={{
          color: 'cyan.400',
          ...textDecorationProps,
          ...(iconOnly ? {} : { textDecoration: 'underline' }),
        }}
        {...(isMobile && {
          mr: '-16px',
        })}
      >
        {iconOnly ? (
          <Icon as={icon} boxSize={5} />
        ) : (
          <HStack as="span" gap={2}>
            <Icon as={icon} size="sm" />
            <span>{text}</span>
          </HStack>
        )}
      </Button>
    </Link>
  );
};
