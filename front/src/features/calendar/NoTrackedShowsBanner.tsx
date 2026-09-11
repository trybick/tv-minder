import { Alert } from '@chakra-ui/react';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';

export const NoTrackedShowsBanner = () => {
  const { isMobile } = useResponsiveLayout();

  return (
    <Alert.Root
      colorPalette="cyan"
      status="info"
      size={isMobile ? 'lg' : 'sm'}
      variant="subtle"
      display="flex"
      alignItems="center"
      h={isMobile ? undefined : '36px'}
      py={isMobile ? undefined : '0'}
      px={isMobile ? undefined : '3'}
    >
      <Alert.Indicator />
      <Alert.Title fontSize="sm" lineHeight="1">
        No new episodes this month
      </Alert.Title>
    </Alert.Root>
  );
};
