import { Box } from '@chakra-ui/react';

import { ChangePasswordContainer } from './ChangePasswordContainer';
import { PreferencesContainer } from './PreferencesContainer';

export const SettingsPage = () => {
  return (
    <>
      <title>Settings | TV Minder</title>
      <Box mt="25px" textAlign="center">
        <PreferencesContainer />
        <ChangePasswordContainer />
      </Box>
    </>
  );
};
