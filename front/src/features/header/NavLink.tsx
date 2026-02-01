import { Button, HStack, Icon, Link } from '@chakra-ui/react';
import { type MouseEvent } from 'react';
import type { IconType } from 'react-icons';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';

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
  const { isMobile } = useResponsiveLayout();
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
        textDecorationColor: 'cyan.500',
        textDecorationThickness: '2px',
        textUnderlineOffset: '4px',
      };

  return (
    <Link
      href={linkTo}
      onClick={handleClick}
      title={iconOnly ? text : undefined}
    >
      <Button
        color={isActive ? 'fg' : 'fg.muted'}
        {...textDecorationProps}
        fontSize="md"
        fontWeight="semibold"
        p={iconOnly ? '8px' : '12px'}
        minW={iconOnly ? 'auto' : undefined}
        variant="plain"
        _hover={{
          color: 'fg',
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
