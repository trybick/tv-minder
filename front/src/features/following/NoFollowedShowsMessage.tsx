import { Button, Flex, Image, Link, Text } from '@chakra-ui/react';
import { type MouseEvent } from 'react';

import { ROUTES } from '~/app/routes';
import noShowsImage from '~/assets/images/tv-remote.jpg';
import { useNavigateWithAnimation } from '~/utils/viewTransition';

export const NoFollowedShowsMessage = () => {
  const navigate = useNavigateWithAnimation();

  const handleClickHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(ROUTES.HOME);
  };

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
      <Link href={ROUTES.HOME} onClick={handleClickHome}>
        <Button colorPalette="cyan">Discover Shows</Button>
      </Link>
    </Flex>
  );
};
