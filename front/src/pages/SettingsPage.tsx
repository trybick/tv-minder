import { Box } from '@chakra-ui/react';
import ChangePasswordContainer from '~/components/settings/ChangePasswordContainer';

const SettingsPage = () => {
  return (
    <>
      <title>Settings | TV Minder</title>
      <Box mt="25px" textAlign="center">
        <ChangePasswordContainer />
      </Box>
    </>
  );
};

export default SettingsPage;
