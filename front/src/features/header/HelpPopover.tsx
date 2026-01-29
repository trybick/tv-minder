import { Box, Flex, Popover, Portal, Text } from '@chakra-ui/react';
import { FiCalendar, FiHeart, FiHelpCircle, FiSearch } from 'react-icons/fi';

const steps = [
  {
    icon: <FiSearch />,
    title: 'Find Shows',
    description: 'Search for your favorite TV shows or browse trending titles',
  },
  {
    icon: <FiHeart />,
    title: 'Follow Them',
    description: 'Click the follow button to add shows to your watchlist',
  },
  {
    icon: <FiCalendar />,
    title: 'Track Episodes',
    description: 'See upcoming episodes in your personalized calendar',
  },
];

export const HelpPopover = () => {
  return (
    <Popover.Root positioning={{ placement: 'bottom' }}>
      <Popover.Trigger asChild>
        <Box
          as="button"
          p="8px"
          borderRadius="md"
          color="fg.muted"
          cursor="pointer"
          _hover={{ bg: 'whiteAlpha.100', color: 'fg' }}
          transition="all 150ms"
          aria-label="Help"
        >
          <FiHelpCircle size={20} />
        </Box>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content maxW="360px">
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Body px={5} py={4}>
              <Text fontWeight="600" fontSize="md" mb={4} textAlign="center">
                How It Works
              </Text>

              <Flex direction="column" gap={4}>
                {steps.map((step, index) => (
                  <Flex key={index} align="center" gap={3}>
                    <Flex
                      align="center"
                      justify="center"
                      w="40px"
                      h="40px"
                      borderRadius="lg"
                      bg="cyan.500/15"
                      color="cyan.400"
                      fontSize="lg"
                      flexShrink={0}
                    >
                      {step.icon}
                    </Flex>
                    <Box flex={1}>
                      <Text fontWeight="600" fontSize="sm">
                        {step.title}
                      </Text>
                      <Text fontSize="sm" color="fg.muted">
                        {step.description}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
