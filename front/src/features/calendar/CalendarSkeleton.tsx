import { Box, Flex, Grid, Skeleton } from '@chakra-ui/react';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';

const EVENT_COUNTS = [
  [0, 1, 2, 0, 1, 0, 2],
  [1, 0, 0, 2, 1, 0, 1],
  [0, 2, 1, 0, 0, 2, 0],
  [1, 0, 2, 1, 0, 0, 1],
  [0, 1, 0, 2, 1, 0, 0],
];

const MOBILE_GROUPS = [
  { dateWidth: '110px', events: 2 },
  { dateWidth: '90px', events: 1 },
  { dateWidth: '120px', events: 3 },
  { dateWidth: '100px', events: 1 },
  { dateWidth: '115px', events: 2 },
];

const EVENT_WIDTHS = ['88%', '72%', '80%'];

const DesktopCalendarSkeleton = () => (
  <Box
    borderWidth="1px"
    borderColor="border.muted"
    borderRadius="lg"
    overflow="hidden"
  >
    <Flex
      display="grid"
      gridTemplateColumns="1fr auto 1fr"
      alignItems="center"
      px={4}
      py={3}
      borderBottomWidth="1px"
      borderColor="border.muted"
      gap={3}
    >
      <Skeleton h="28px" w="150px" borderRadius="md" />
      <Skeleton h="26px" w="88px" borderRadius="full" />
      <Flex justifySelf="end" gap={2}>
        <Skeleton h="38px" w="76px" borderRadius="md" />
        <Skeleton h="38px" w="38px" borderRadius="md" />
        <Skeleton h="38px" w="38px" borderRadius="md" />
      </Flex>
    </Flex>

    <Grid
      templateColumns="repeat(7, 1fr)"
      borderBottomWidth="1px"
      borderColor="border.muted"
    >
      {[...Array(7)].map((_, i) => (
        <Flex key={i} justify="center" py="10px">
          <Skeleton h="13px" w="26px" borderRadius="sm" />
        </Flex>
      ))}
    </Grid>

    {EVENT_COUNTS.map((row, rowIdx) => (
      <Grid
        key={rowIdx}
        templateColumns="repeat(7, 1fr)"
        borderBottomWidth={rowIdx < EVENT_COUNTS.length - 1 ? '1px' : '0'}
        borderColor="border.muted"
      >
        {row.map((eventCount, colIdx) => (
          <Box
            key={colIdx}
            borderLeftWidth={colIdx > 0 ? '1px' : '0'}
            borderColor="border.muted"
            p={2}
            minH="110px"
          >
            <Flex justify="flex-end" mb={2}>
              <Skeleton h="15px" w="18px" borderRadius="sm" />
            </Flex>
            <Flex direction="column" gap={1}>
              {[...Array(eventCount)].map((_, eIdx) => (
                <Skeleton
                  key={eIdx}
                  h="20px"
                  w={EVENT_WIDTHS[eIdx % EVENT_WIDTHS.length]}
                  borderRadius="sm"
                />
              ))}
            </Flex>
          </Box>
        ))}
      </Grid>
    ))}
  </Box>
);

const MobileCalendarSkeleton = () => (
  <Box
    borderWidth="1px"
    borderColor="border.muted"
    borderRadius="lg"
    overflow="hidden"
  >
    {MOBILE_GROUPS.map((group, i) => (
      <Box
        key={i}
        px={4}
        py={3}
        borderBottomWidth={i < MOBILE_GROUPS.length - 1 ? '1px' : '0'}
        borderColor="border.muted"
      >
        <Skeleton h="15px" w={group.dateWidth} mb={3} borderRadius="sm" />
        {[...Array(group.events)].map((_, eIdx) => (
          <Skeleton key={eIdx} h="40px" w="100%" mb={2} borderRadius="md" />
        ))}
      </Box>
    ))}
  </Box>
);

export const CalendarSkeleton = () => {
  const { isMobile } = useResponsiveLayout();
  return isMobile ? <MobileCalendarSkeleton /> : <DesktopCalendarSkeleton />;
};
