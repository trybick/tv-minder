import { Box, Button, Collapsible, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

import { DelayedSkeletonText } from '~/components/DelayedSkeletonText';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show?: ShowForDisplay | null;
};

const COLLAPSED_OVERVIEW_HEIGHT = 100;

/**
 * Overview text.
 * Desktop long text collapses; mobile shows full text.
 * */
export const Overview = ({ show }: Props) => {
  const { isMobile } = useResponsiveLayout();
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { overview } = show || {};

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOverviewOverflowing, setIsOverviewOverflowing] = useState(false);

  const shouldCollapseOverview = !isMobile && !!overview;
  const shouldShowOverviewToggle =
    shouldCollapseOverview && isOverviewOverflowing;

  useEffect(() => {
    if (!shouldCollapseOverview || !overview) {
      queueMicrotask(() => {
        setIsOverviewOverflowing(false);
      });
      return;
    }

    const checkOverviewOverflow = () => {
      const contentElement = contentRef.current;
      if (!contentElement) {
        return;
      }

      setIsOverviewOverflowing(
        contentElement.scrollHeight > COLLAPSED_OVERVIEW_HEIGHT + 1
      );
    };

    checkOverviewOverflow();
    window.addEventListener('resize', checkOverviewOverflow);

    return () => {
      window.removeEventListener('resize', checkOverviewOverflow);
    };
  }, [overview, shouldCollapseOverview]);

  if (!isLoading && !overview) {
    return null;
  }

  return (
    <Box mb={shouldCollapseOverview ? 4 : 6}>
      {isLoading ? (
        <DelayedSkeletonText isLoading={isLoading} noOfLines={6} w="100%" />
      ) : shouldCollapseOverview ? (
        <Collapsible.Root collapsedHeight={`${COLLAPSED_OVERVIEW_HEIGHT}px`}>
          <Collapsible.Content
            ref={contentRef}
            overflow="hidden"
            _closed={{
              maskImage: shouldShowOverviewToggle
                ? 'linear-gradient(to bottom, black 60px, transparent 100%)'
                : undefined,
            }}
          >
            <Text
              color="fg"
              fontSize="md"
              lineHeight="1.7"
              letterSpacing="0.01em"
            >
              {overview}
            </Text>
          </Collapsible.Content>
          {shouldShowOverviewToggle && (
            <Collapsible.Trigger asChild mt={2}>
              <Button
                variant="plain"
                size="sm"
                color="fg.muted"
                px={0}
                _hover={{ color: 'fg' }}
              >
                <Collapsible.Context>
                  {api => (api.open ? 'Show less' : 'Show more')}
                </Collapsible.Context>
                <Collapsible.Indicator
                  transition="transform 0.2s"
                  _open={{ transform: 'rotate(180deg)' }}
                >
                  <LuChevronDown />
                </Collapsible.Indicator>
              </Button>
            </Collapsible.Trigger>
          )}
        </Collapsible.Root>
      ) : (
        <Text color="fg" fontSize="md" lineHeight="1.7" letterSpacing="0.01em">
          {overview}
        </Text>
      )}
    </Box>
  );
};
