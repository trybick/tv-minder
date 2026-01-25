import { Box } from '@chakra-ui/react';

type Props = {
  label: string;
  color: string;
};

export const StatusBadge = ({ label, color }: Props) => (
  <Box
    position="absolute"
    top="2"
    left="2"
    bg={color}
    color="white"
    fontSize="xs"
    fontWeight="bold"
    px="2"
    py="1"
    borderRadius="md"
    letterSpacing="0.2px"
    textTransform="uppercase"
  >
    {label}
  </Box>
);
