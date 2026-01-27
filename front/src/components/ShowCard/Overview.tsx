import { Box, Text } from '@chakra-ui/react';

type Props = {
  overview: string | undefined;
  isHovered: boolean;
};

export const Overview = ({ overview, isHovered }: Props) => {
  if (!overview) {
    return null;
  }

  return (
    <Box
      position="absolute"
      inset="0"
      bg="linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.4) 100%)"
      opacity={isHovered ? 1 : 0}
      transition="opacity 0.25s ease-out"
      p="3.5"
      display={{ base: 'none', md: 'flex' }}
      alignItems="flex-end"
    >
      <Text fontSize="sm" lineClamp={6} color="white" lineHeight="1.5">
        {overview}
      </Text>
    </Box>
  );
};
