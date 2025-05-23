import { Accordion, Box, Flex, Heading, Text } from '@chakra-ui/react';
import moment from 'moment';

import { BasicShowInfo } from '~/types/external';

import EpisodesTable from './subcomponents/EpisodesTable';

type Props = {
  isMobile: boolean;
  showInfoForDisplay: BasicShowInfo;
};

const SeasonAccordionGroup = ({ isMobile, showInfoForDisplay }: Props) => {
  const { seasonsWithEpisodes } = showInfoForDisplay || {};

  const createAccordionItems = () =>
    seasonsWithEpisodes.map(
      ({ airDate, episodes, id, isSpecialsSeason, nameForDisplay }) => (
        <Accordion.Item key={id} value={id.toString()}>
          <Accordion.ItemTrigger
            cursor="pointer"
            px={isMobile ? '8px' : '16px'}
          >
            <Box flex="1" textAlign="left">
              <Text display="inline" fontSize="lg" fontWeight="600">
                {nameForDisplay}
              </Text>{' '}
              {!isSpecialsSeason && airDate && (
                <Text display="inline" fontSize="md">
                  ({moment(airDate).year()})
                </Text>
              )}
            </Box>
            <Box mr="20px" textAlign="right">
              <Text fontSize="md">{episodes.length} Episodes</Text>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent p={isMobile ? '10px 0 5px' : '10px'}>
            <EpisodesTable episodes={episodes} isMobile={isMobile} />
          </Accordion.ItemContent>
        </Accordion.Item>
      )
    );

  return (
    <Flex direction="column" flex="1" mt={isMobile ? '18px' : '50px'}>
      <Heading
        as="h4"
        fontSize={isMobile ? 'xl' : '2xl'}
        ml={isMobile ? '' : '14px'}
      >
        Episodes
      </Heading>
      <Accordion.Root mt="14px" w="100%" collapsible>
        {createAccordionItems()}
      </Accordion.Root>
    </Flex>
  );
};

export default SeasonAccordionGroup;
