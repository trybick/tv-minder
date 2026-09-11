import { Box } from '@chakra-ui/react';
import { FiSettings } from 'react-icons/fi';

import { PageContainer } from '~/components/PageContainer';
import { SectionHeader } from '~/components/SectionHeader';
import { useAppSelector } from '~/store';
import { selectEmail } from '~/store/rtk/slices/user.slice';

import { ChangePasswordContainer } from './ChangePasswordContainer';

export const SettingsPage = () => {
  const email = useAppSelector(selectEmail);

  return (
    <>
      <title>Settings | TV Minder</title>
      <PageContainer py={{ base: 6, md: 10 }}>
        <Box maxW="lg" mx="auto">
          <SectionHeader
            as="h1"
            icon={<FiSettings />}
            title="Settings"
            subtitle={email || 'Manage your account'}
            mb={6}
          />

          <ChangePasswordContainer />
        </Box>
      </PageContainer>
    </>
  );
};
