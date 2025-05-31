import { Button, Flex, Image, Text } from '@chakra-ui/react';

import { ROUTES } from '~/constants/routes';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import noShowsImage from '~/images/tv-remote.jpg';

const NoFollowedShowsMessage = () => {
  const navigate = useNavigateWithAnimation();

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      gap="16px"
      m="40px auto 0"
      maxW="400px"
    >
      <Image borderRadius="6px" h="266.7px" mb="14px" src={noShowsImage} />
      <Text
        fontSize="lg"
        fontWeight="600"
        mb={1}
        textAlign="center"
        color="cyan.500"
      >
        Follow some shows to see them here and on your calendar.
      </Text>
      <Button colorPalette="cyan" onClick={() => navigate(ROUTES.HOME)}>
        Discover Shows
      </Button>
    </Flex>
  );
};

export default NoFollowedShowsMessage;
