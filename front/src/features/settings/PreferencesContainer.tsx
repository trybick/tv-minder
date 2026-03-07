import { Box, Flex, Heading, Switch, Text } from '@chakra-ui/react';

import { showToast } from '~/components/ui/toaster';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '~/store/rtk/api/settings.api';
import { handleRtkQueryError } from '~/utils/handleRtkQueryError';

export const PreferencesContainer = () => {
  const { data: settings, isLoading: isLoadingSettings } =
    useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  const handleToggleWelcomeStrip = async () => {
    const newValue = !settings?.showWelcomeStrip;
    try {
      await updateSettings({ showWelcomeStrip: newValue }).unwrap();
    } catch (error) {
      handleRtkQueryError(error);
      showToast({
        title: 'An error occurred',
        description: 'Your preference could not be updated.',
        type: 'error',
      });
    }
  };

  return (
    <Box
      as="section"
      borderRadius="4px"
      borderWidth="1px"
      margin="20px auto"
      p={5}
      w={['80%', '75%', '50%', '30%']}
    >
      <Heading as="h4" fontSize="1.6rem" textAlign="center" mb={4}>
        Preferences
      </Heading>

      <Flex justify="space-between" align="center">
        <Text fontSize="sm">Show welcome message on Discover page</Text>
        <Switch.Root
          checked={settings?.showWelcomeStrip ?? true}
          onCheckedChange={handleToggleWelcomeStrip}
          disabled={isLoadingSettings}
          colorPalette="cyan"
        >
          <Switch.HiddenInput />
          <Switch.Control />
        </Switch.Root>
      </Flex>
    </Box>
  );
};
