import { Button, Flex, Image, Text } from '@chakra-ui/react';

import { ROUTES } from '~/constants/routes';
import { useViewTransition } from '~/hooks/useViewTransition';
import noShowsImage from '~/images/tv-remote.jpg';

const NoFollowedShowsMessage = () => {
  const navigateWithTransition = useViewTransition();

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      gap="16px"
      m="40px auto 0"
      maxW="400px"
    >
      <Image borderRadius="6px" h="266.7px" mb="14px" src={noShowsImage} />
      <Text fontSize="md" fontWeight="500" mb="2px" textAlign="center">
        You are not following any shows yet.
      </Text>
      <Button
        colorPalette="cyan"
        onClick={() => navigateWithTransition(ROUTES.HOME)}
      >
        Discover Shows
      </Button>
    </Flex>
  );
};

export default NoFollowedShowsMessage;
