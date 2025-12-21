import { Alert, Link } from '@chakra-ui/react';
import { MouseEvent } from 'react';

import { ROUTES } from '~/app/routes';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useAppSelector } from '~/store';
import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';

const NoFollowedShowsBanner = () => {
  const navigate = useNavigateWithAnimation();
  const followedShows = useAppSelector(selectFollowedShows);

  const handleClickHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(ROUTES.HOME);
  };

  return (
    <Alert.Root colorPalette="cyan" justifyContent="center" status="info">
      <Alert.Indicator />
      {followedShows.length ? (
        <Alert.Title>
          There are no new episodes of the shows you follow airing this month.
        </Alert.Title>
      ) : (
        <Alert.Title>
          <Link
            onClick={handleClickHome}
            textDecorationThickness="2px"
            variant="underline"
            href={ROUTES.HOME}
          >
            Follow some shows
          </Link>{' '}
          to see them in your calendar.
        </Alert.Title>
      )}
    </Alert.Root>
  );
};

export default NoFollowedShowsBanner;
