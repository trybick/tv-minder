import { Alert, Link } from '@chakra-ui/react';
import { type MouseEvent } from 'react';

import { ROUTES } from '~/app/routes';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';

export const NoFollowedShowsBanner = () => {
  const { isMobile } = useResponsiveLayout();
  const navigate = useNavigateWithAnimation();
  const followedShows = useAppSelector(selectFollowedShows);

  const handleClickHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(ROUTES.HOME);
  };

  return (
    <Alert.Root
      colorPalette="cyan"
      status="info"
      size={isMobile ? 'lg' : 'sm'}
      variant="subtle"
      display="flex"
      alignItems="center"
    >
      <Alert.Indicator />
      {followedShows.length ? (
        <Alert.Title fontSize="14px">No new episodes this month</Alert.Title>
      ) : (
        <Alert.Title fontSize="14px">
          <Link
            onClick={handleClickHome}
            textDecorationThickness="2px"
            variant="underline"
            href={ROUTES.HOME}
          >
            Follow some shows
          </Link>{' '}
          to see new episodes in your calendar
        </Alert.Title>
      )}
    </Alert.Root>
  );
};
