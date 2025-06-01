import { Box } from '@chakra-ui/react';

import { ROUTES } from '~/app/routes';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/user/selectors';

import NavLink from './NavLink';

interface NavigationLinksProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const NavigationLinks = ({ onClose, isMobile }: NavigationLinksProps) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <Box
      display="flex"
      flex="1"
      justifyContent="center"
      gap="10px"
      pt="6px"
      w={{ base: 'full', md: 'auto' }}
      {...(isMobile && {
        alignItems: 'flex-end',
        flexDir: 'column',
        ml: 'auto',
        mr: 'unset',
      })}
    >
      <NavLink linkTo={ROUTES.HOME} text="Discover" onClose={onClose} />
      <NavLink linkTo={ROUTES.CALENDAR} text="Calendar" onClose={onClose} />
      {isLoggedIn && (
        <NavLink linkTo={ROUTES.MANAGE} text="Manage" onClose={onClose} />
      )}
    </Box>
  );
};

export default NavigationLinks;
