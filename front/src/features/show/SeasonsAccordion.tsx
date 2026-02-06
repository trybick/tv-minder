import { Accordion, Box, Flex, Text } from '@chakra-ui/react';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
} from '~/store/tv/selectors';
import { dayjs } from '~/utils/dayjs';

import { EpisodesTable } from './EpisodesTable';

export const SeasonsAccordion = () => {
  const { isMobile } = useResponsiveLayout();
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const { seasonsWithEpisodes } = currentShowInfo || {};
  const hasEpisodes =
    currentShowInfo?.seasonsWithEpisodes?.[0]?.episodes?.length;

  const createAccordionItems = () =>
    seasonsWithEpisodes?.map(
      ({ airDate, episodes, id, isSpecialsSeason, nameForDisplay }) => (
        <Accordion.Item
          key={id}
          value={id.toString()}
          borderBottomWidth="1px"
          borderColor="whiteAlpha.200"
          _last={{ borderBottomWidth: 0 }}
        >
          <Accordion.ItemTrigger
            cursor="pointer"
            px={isMobile ? '8px' : '16px'}
            py={4}
            _hover={{ bg: 'whiteAlpha.50' }}
            _open={{ bg: 'whiteAlpha.50' }}
            transition="background 0.2s"
          >
            <Flex flex="1" direction="column" textAlign="left" gap={1}>
              <Box>
                <Text
                  display="inline"
                  fontSize="lg"
                  fontWeight="600"
                  color="fg"
                >
                  {nameForDisplay}
                </Text>{' '}
                {!isSpecialsSeason && airDate && (
                  <Text
                    display="inline"
                    fontSize="md"
                    color="fg.muted"
                    ml={0.5}
                  >
                    ({dayjs(airDate).year()})
                  </Text>
                )}
              </Box>
              <Text fontSize="sm" color="fg.muted">
                {episodes.length} Episodes
              </Text>
            </Flex>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <EpisodesTable episodes={episodes} />
          </Accordion.ItemContent>
        </Accordion.Item>
      )
    );

  if (!isLoading && !hasEpisodes) {
    return null;
  }

  return (
    <Flex direction="column" flex="1" mt={isMobile ? 6 : 12}>
      <DelayedSkeleton
        isLoading={isLoading}
        w="100%"
        h={isLoading ? '300px' : undefined}
      >
        <Accordion.Root w="100%" collapsible>
          {createAccordionItems()}
        </Accordion.Root>
      </DelayedSkeleton>
    </Flex>
  );
};
