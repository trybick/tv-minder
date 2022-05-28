import { Link as RouterLink } from 'react-router-dom';
import { HStack, Icon, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { FiAlertTriangle } from 'react-icons/fi';
import { ROUTES } from 'constants/routes';

const NoFollowedShowsBanner = () => (
  <Stack
    alignItems="center"
    bg={useColorModeValue('yellow.600', 'yellow.400')}
    color={useColorModeValue('white', 'black')}
    direction={{ base: 'column', sm: 'row' }}
    justifyContent="center"
    px={{ base: '3', md: '6', lg: '8' }}
    py="4"
  >
    <HStack spacing="3">
      <Icon as={FiAlertTriangle} fontSize="2xl" h="6" />
      <Text fontWeight="medium">
        New episodes will appear here!{' '}
        <Link as={RouterLink} fontWeight={900} to={ROUTES.HOME}>
          Click here to follow a show.
        </Link>
      </Text>
    </HStack>
  </Stack>
);

export default NoFollowedShowsBanner;
