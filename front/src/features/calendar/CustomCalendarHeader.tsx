import { Box, Button, Flex, Text } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import { RefObject } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { useIsMobile } from '~/hooks/useIsMobile';

import NoFollowedShowsBanner from './NoFollowedShowsBanner';

type Props = {
  calendarRef: RefObject<FullCalendar | null>;
  hasEpisodesInCurrentMonth: boolean;
  title: string;
};

const CustomCalendarHeader = ({
  calendarRef,
  hasEpisodesInCurrentMonth,
  title,
}: Props) => {
  const isMobile = useIsMobile();

  const handlePrev = () => calendarRef.current?.getApi().prev();
  const handleNext = () => calendarRef.current?.getApi().next();
  const handleToday = () => calendarRef.current?.getApi().today();

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr auto 1fr"
      alignItems="center"
      mb={4}
      gap={3}
    >
      <Text fontSize="3xl" justifySelf="start">
        {title}
      </Text>

      <Box>
        {!isMobile && !hasEpisodesInCurrentMonth && <NoFollowedShowsBanner />}
      </Box>

      <Flex align="center" gap={2} justifySelf="end">
        <Button size="sm" variant="subtle" onClick={handleToday}>
          today
        </Button>
        <Button size="sm" variant="subtle" onClick={handlePrev}>
          <LuChevronLeft />
        </Button>
        <Button size="sm" variant="subtle" onClick={handleNext}>
          <LuChevronRight />
        </Button>
      </Flex>
    </Box>
  );
};

export default CustomCalendarHeader;
