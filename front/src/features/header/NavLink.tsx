import { Button, HStack, Icon, Link } from '@chakra-ui/react';
import { type MouseEvent } from 'react';
import type { IconType } from 'react-icons';
import { useLocation } from 'wouter';

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
  const [location, navigate] = useLocation();
  const isActive = location === linkTo;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose?.();
    onClick?.();
    navigate(linkTo);
  };

  const navLinkPadding = isMobile
    ? iconOnly
      ? '1.5'
      : '2'
    : iconOnly
      ? '2'
      : '3';

  return (
    <Link
      href={linkTo}
      onClick={handleClick}
      title={iconOnly ? text : undefined}
    >
      <Button
        color={isActive ? 'cyan.300' : 'fg.muted'}
        bg={isActive ? 'cyan.400/10' : 'transparent'}
        _hover={{
          color: isActive ? 'cyan.300' : 'fg',
          bg: isActive ? 'cyan.400/10' : 'whiteAlpha.100',
        }}
        borderRadius="full"
        transition="background 150ms, color 150ms"
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
            <span>{text}</span>
          </HStack>
        )}
      </Button>
    </Link>
  );
};
