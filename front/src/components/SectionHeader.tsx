import { Box, Flex, type FlexProps, Heading, Text } from '@chakra-ui/react';
import { type ReactNode } from 'react';

type Props = FlexProps & {
  icon: ReactNode;
  title: string;
  subtitle: string;
  as?: 'h1' | 'h2';
};

export const SectionHeader = ({
  icon,
  title,
  subtitle,
  as = 'h2',
  ...props
}: Props) => {
  return (
    <Flex align="center" gap={3} mb={4} {...props}>
      <Flex
        align="center"
        justify="center"
        boxSize="40px"
        rounded="xl"
        bg="cyan.500/15"
        borderWidth="1px"
        borderColor="cyan.400/20"
        color="cyan.300"
        fontSize="xl"
        flexShrink={0}
      >
        {icon}
      </Flex>

      <Box minW={0}>
        <Heading
          as={as}
          fontSize={{ base: 'lg', md: 'xl' }}
          fontWeight="semibold"
          letterSpacing="tight"
          lineHeight="shorter"
          color="fg"
        >
          {title}
        </Heading>

        <Text fontSize="sm" color="fg.muted" mt="0.5" lineClamp={1}>
          {subtitle}
        </Text>
      </Box>
    </Flex>
  );
};
