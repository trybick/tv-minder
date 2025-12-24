import { Alert, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const DELAY_MS = 200;

const UpdatingCalendarBanner = () => {
  const [shouldShowBanner, setShouldShowBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldShowBanner(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldShowBanner) return null;

  return (
    <Alert.Root
      colorPalette="cyan"
      status="info"
      size="sm"
      variant="subtle"
      w="fit-content"
    >
      <Spinner size="sm" />
      <Alert.Title fontSize="14px">Updating your calendar</Alert.Title>
    </Alert.Root>
  );
};

export default UpdatingCalendarBanner;
