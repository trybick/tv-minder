import { Link as RouterLink } from 'react-router-dom';
import { Box, Image, Link, Text } from '@chakra-ui/react';
import { ROUTES } from 'constants/routes';
import noShowsImage from '../../images/tv-remote.jpg';

const NoFollowedShowsMessage = () => (
  <Box m="40px auto 0" maxW="400px">
    <Image borderRadius="6px" h="266.7px" mb="14px" src={noShowsImage} />
    <Text fontSize="lg" fontWeight="500" mb="2px" textAlign="center">
      You are not following any shows yet.
    </Text>
    <Text color="blue.400" fontSize="4xl" fontWeight="500" textAlign="center">
      <Link as={RouterLink} to={ROUTES.HOME}>
        Click here to start
      </Link>
    </Text>
  </Box>
);

export default NoFollowedShowsMessage;
