import { Accordion, Box, Flex, Heading, Text } from '@chakra-ui/react';

import DelayedSkeleton from '~/components/DelayedSkeleton';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
} from '~/store/tv/selectors';
import dayjs from '~/utils/dayjs';

import EpisodesTable from './EpisodesTable';

const SeasonAccordionGroup = () => {
  const isMobile = useIsMobile();
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
          borderColor="whiteAlpha.100"
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
            <Box flex="1" textAlign="left">
              <Text display="inline" fontSize="lg" fontWeight="600" color="fg">
                {nameForDisplay}
              </Text>{' '}
              {!isSpecialsSeason && airDate && (
                <Text display="inline" fontSize="md" color="fg.muted" ml={0.5}>
                  ({dayjs(airDate).year()})
                </Text>
              )}
            </Box>
            <Box mr="20px" textAlign="right">
              <Text fontSize="sm" color="fg.muted">
                {episodes.length} Episodes
              </Text>
            </Box>
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
      <DelayedSkeleton isLoading={isLoading}>
        <Heading as="h2" fontSize="xl" fontWeight="600" mb={4}>
          Episodes
        </Heading>
        <Accordion.Root w="100%" collapsible>
          {createAccordionItems()}
        </Accordion.Root>
      </DelayedSkeleton>
    </Flex>
  );
};

export default SeasonAccordionGroup;
