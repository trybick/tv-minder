import { Helmet } from 'react-helmet-async';
import { Box } from '@chakra-ui/react';
import ChangePasswordContainer from 'components/settings/ChangePasswordContainer';

const SettingsPage = () => (
  <Box mt="25px" textAlign="center">
    <Helmet title="Settings | TV Minder" />
    <ChangePasswordContainer />
  </Box>
);

export default SettingsPage;
