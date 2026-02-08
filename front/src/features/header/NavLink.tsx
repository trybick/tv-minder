import { Button, chakra, HStack, Icon, Link } from '@chakra-ui/react';
import { type MouseEvent, useState } from 'react';
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

  const [isHovered, setIsHovered] = useState(false);

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

  const navLinkPadding = isMobile
    ? iconOnly
      ? '1.5'
      : '2'
    : iconOnly
      ? '8px'
      : '12px';

  return (
    <Link
      href={linkTo}
      onClick={handleClick}
      title={iconOnly ? text : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        color={isActive || isHovered ? 'fg' : 'fg.muted'}
        fontSize={isMobile ? 'sm' : 'md'}
        fontWeight="semibold"
        p={navLinkPadding}
        minW={iconOnly ? 'auto' : undefined}
        variant="plain"
        {...(isMobile && {
          mr: '-2',
        })}
      >
        {iconOnly ? (
          <Icon as={icon} boxSize={4} />
        ) : (
          <HStack as="span" gap="1.5">
            <Icon as={icon} boxSize="1.1em" />
            <chakra.span
              textDecoration={isActive || isHovered ? 'underline' : 'none'}
              textDecorationColor="cyan.500"
              textDecorationThickness="2px"
              textUnderlineOffset="4px"
            >
              {text}
            </chakra.span>
          </HStack>
        )}
      </Button>
    </Link>
  );
};
