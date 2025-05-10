import { Alert, Link } from '@chakra-ui/react';

import { ROUTES } from '~/constants/routes';
import { useViewTransition } from '~/hooks/useViewTransition';

const NoFollowedShowsBanner = () => {
  const navigateWithTransition = useViewTransition();

  return (
    <Alert.Root colorPalette="cyan" justifyContent="center" status="info">
      <Alert.Indicator />
      <Alert.Title>
        <Link
          onClick={() => navigateWithTransition(ROUTES.HOME)}
          textDecorationThickness="2px"
          variant="underline"
        >
          Follow some shows
        </Link>{' '}
        to see them in your calendar.
      </Alert.Title>
    </Alert.Root>
  );
};

export default NoFollowedShowsBanner;
