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
          <Popover.Content maxW="580px">
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Body p={8}>
              <Text fontWeight="600" fontSize="xl" mb={6} textAlign="center">
                How It Works
              </Text>

              <Flex direction="column" gap={6}>
                {steps.map((step, index) => (
                  <Flex key={index} align="flex-start" gap={4}>
                    <Flex
                      align="center"
                      justify="center"
                      w="52px"
                      h="52px"
                      borderRadius="full"
                      bg="cyan.500/15"
                      color="cyan.400"
                      fontSize="xl"
                      flexShrink={0}
                    >
                      {step.icon}
                    </Flex>
                    <Box>
                      <Text fontWeight="600" fontSize="md">
                        {step.title}
                      </Text>
                      <Text fontSize="sm" color="fg.muted" lineHeight="short">
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
