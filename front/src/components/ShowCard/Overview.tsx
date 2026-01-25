import { Box, Text } from '@chakra-ui/react';

type Props = {
  overview: string | undefined;
  isHovered: boolean;
};

export const Overview = ({ overview, isHovered }: Props) => {
  if (!overview) return null;

  return (
    <Box
      position="absolute"
      inset="0"
      bg="blackAlpha.800"
      opacity={isHovered ? 1 : 0}
      transition="opacity 0.2s"
      p="3"
      display={{ base: 'none', md: 'flex' }}
      alignItems="flex-end"
    >
      <Text fontSize="sm" lineClamp={6} color="white">
        {overview}
      </Text>
    </Box>
  );
};
