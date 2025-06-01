import { Box } from '@chakra-ui/react';

import { ROUTES } from '~/app/routes';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/user/selectors';

import NavLink from './NavLink';

interface NavigationLinksProps {
  onClose?: () => void;
}

const NavigationLinks = ({ onClose }: NavigationLinksProps) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isMobile = useIsMobile();

  return (
    <Box
      display="flex"
      flex="1"
      justifyContent="center"
      gap="10px"
      {...(isMobile && {
        flexDirection: 'column',
        alignItems: 'flex-end',
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
