import {
  Box,
  Flex,
  Heading,
  IconButton,
  Popover,
  Portal,
  Separator,
  Text,
} from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import { LuCircleHelp } from 'react-icons/lu';

type HowItWorksStep = {
  icon: ReactNode;
  label: string;
};

const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  { icon: <FiSearch />, label: 'Search for a show and click Track' },
  { icon: <FiCalendar />, label: 'See new episodes on your calendar' },
];

export const HelpPopover = () => {
  return (
    <Popover.Root
      positioning={{ placement: 'bottom-end', gutter: 8 }}
      lazyMount
    >
      <Popover.Trigger asChild>
        <IconButton
          aria-label="How it works"
          variant="ghost"
          size="md"
          color="fg.muted"
        >
          <LuCircleHelp size={20} />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            bg="gray.900"
            borderColor="whiteAlpha.200"
            boxShadow="xl"
            w="330px"
          >
            <Popover.Body p={5}>
              <Heading
                as="h3"
                fontSize="md"
                fontWeight="700"
                letterSpacing="-0.02em"
                lineHeight="1.3"
              >
                Your personal TV calendar
              </Heading>
              <Text color="fg.muted" fontSize="xs" mt={1.5} lineHeight="1.5">
                Track shows to get a schedule of all your upcoming episodes.
              </Text>

              <Separator my={4} borderColor="whiteAlpha.200" />

              <Text
                color="fg.muted"
                fontSize="2xs"
                fontWeight="700"
                letterSpacing="0.08em"
                textTransform="uppercase"
                mb={3}
              >
                How it works
              </Text>

              <Flex direction="column" gap={3}>
                {HOW_IT_WORKS_STEPS.map(step => (
                  <Flex key={step.label} align="center" gap={3}>
                    <Flex
                      align="center"
                      justify="center"
                      boxSize="32px"
                      borderRadius="full"
                      bg="cyan.400/10"
                      borderWidth="1px"
                      borderColor="cyan.400/30"
                      color="cyan.400"
                      fontSize="sm"
                      flexShrink={0}
                    >
                      {step.icon}
                    </Flex>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="fg.default"
                      lineClamp={1}
                      minW={0}
                    >
                      {step.label}
                    </Text>
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
