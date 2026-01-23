import { Box, Button, Collapsible, Text } from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';

import { DelayedSkeletonText } from '~/components/DelayedSkeletonText';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show?: ShowForDisplay | null;
};

export const Overview = ({ show }: Props) => {
  const isMobile = useIsMobile();
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { overview } = show || {};

  const shouldCollapseOverview =
    !isMobile && !!overview && overview.length > 260;

  if (!isLoading && !overview) {
    return null;
  }

  return (
    <Box mb={shouldCollapseOverview ? 4 : 6}>
      {isLoading ? (
        <DelayedSkeletonText isLoading={isLoading} noOfLines={6} w="100%" />
      ) : shouldCollapseOverview ? (
        <Collapsible.Root collapsedHeight="100px">
          <Collapsible.Content
            overflow="hidden"
            _closed={{
              maskImage:
                'linear-gradient(to bottom, black 60px, transparent 100%)',
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
        </Collapsible.Root>
      ) : (
        <Text color="fg" fontSize="md" lineHeight="1.7" letterSpacing="0.01em">
          {overview}
        </Text>
      )}
    </Box>
  );
};
