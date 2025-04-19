import { Alert, Link } from '@chakra-ui/react';
import { useLocation } from 'wouter';
import { ROUTES } from 'constants/routes';

const NoFollowedShowsBanner = () => {
  const [, navigate] = useLocation();

  return (
    <Alert.Root colorPalette="cyan" justifyContent="center" status="info">
      <Alert.Indicator />
      <Alert.Title>
        <Link
          onClick={() => navigate(ROUTES.HOME)}
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
