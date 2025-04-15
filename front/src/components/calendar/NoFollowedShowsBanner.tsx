import { useHistory } from 'react-router-dom';
import { Alert, Link } from '@chakra-ui/react';
import { ROUTES } from 'constants/routes';

const NoFollowedShowsBanner = () => {
  const history = useHistory();

  return (
    <Alert.Root colorPalette="cyan" justifyContent="center" status="info">
      <Alert.Indicator />
      <Alert.Title>
        New episodes of your followed shows will appear here on your calendar. Start following shows{' '}
        <Link
          onClick={() => history.push(ROUTES.HOME)}
          textDecorationThickness="2px"
          variant="underline"
        >
          here.
        </Link>
      </Alert.Title>
    </Alert.Root>
  );
};

export default NoFollowedShowsBanner;
