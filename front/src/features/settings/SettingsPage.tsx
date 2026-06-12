import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { FiSettings } from 'react-icons/fi';

import { useAppSelector } from '~/store';
import { selectEmail } from '~/store/rtk/slices/user.slice';

import { ChangePasswordContainer } from './ChangePasswordContainer';

export const SettingsPage = () => {
  const email = useAppSelector(selectEmail);

  return (
    <>
      <title>Settings | TV Minder</title>
      <Box maxW="lg" mx="auto" w="100%" px={4} py={{ base: 6, md: 10 }}>
        <Flex align="center" gap={2.5} mb={5}>
          <Flex
            align="center"
            justify="center"
            w="38px"
            h="38px"
            borderRadius="lg"
            bg="cyan.500/15"
            color="cyan.400"
            fontSize="xl"
          >
            <FiSettings />
          </Flex>

          <Box>
            <Heading
              as="h1"
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="700"
              color="fg"
            >
              Settings
            </Heading>

            <Text fontSize="xs" color="fg.muted" mt="1px">
              {email || 'Manage your account'}
            </Text>
          </Box>
        </Flex>

        <ChangePasswordContainer />
      </Box>
    </>
  );
};
