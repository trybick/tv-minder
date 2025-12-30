import { Flex } from '@chakra-ui/react';

import { ROUTES } from '~/app/routes';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import { setShouldResetSearchInput } from '~/store/rtk/slices/searchInput.slice';
import {
  selectIsGoogleUser,
  selectIsLoggedIn,
} from '~/store/rtk/slices/user.slice';

import NavLink from './NavLink';

interface Props {
  onClose?: () => void;
}

const NavigationLinks = ({ onClose }: Props) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isGoogleUser = useAppSelector(selectIsGoogleUser);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

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
      <NavLink
        linkTo={ROUTES.HOME}
        text="Discover"
        onClose={onClose}
        onClick={() => dispatch(setShouldResetSearchInput(true))}
      />
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
