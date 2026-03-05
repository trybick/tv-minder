import { Alert } from '@chakra-ui/react';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';

export const NoFollowedShowsBanner = () => {
  const { isMobile } = useResponsiveLayout();

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
      <Alert.Title fontSize="14px">No new episodes this month</Alert.Title>
    </Alert.Root>
  );
};
