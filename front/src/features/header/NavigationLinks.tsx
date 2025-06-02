import { Flex } from '@chakra-ui/react';

import { ROUTES } from '~/app/routes';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import { selectIsGoogleUser, selectIsLoggedIn } from '~/store/user/selectors';

import NavLink from './NavLink';

interface Props {
  onClose?: () => void;
}

const NavigationLinks = ({ onClose }: Props) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isGoogleUser = useAppSelector(selectIsGoogleUser);
  const isMobile = useIsMobile();

  return (
    <Flex
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

      {isMobile && isLoggedIn && !isGoogleUser ? (
        <NavLink linkTo={ROUTES.SETTINGS} text="Settings" onClose={onClose} />
      ) : null}
    </Flex>
  );
};

export default NavigationLinks;
