import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { BasicShowInfo } from 'types/external';
import EpisodesTable from './subcomponents/EpisodesTable';

interface Props {
  isMobile: boolean;
  showInfoForDisplay: BasicShowInfo;
}

const SeasonAccordionGroup = ({ isMobile, showInfoForDisplay }: Props) => {
  const { seasonsWithEpisodes } = showInfoForDisplay || {};

  const createAccordionItems = () =>
    seasonsWithEpisodes.map(season => (
      <AccordionItem key={season.id}>
        <AccordionButton px={isMobile ? '8px' : '16px'}>
          <Box flex="1" textAlign="left">
            <Text d="inline" fontSize="lg" fontWeight="600">
              {season.nameForDisplay}
            </Text>{' '}
            {season.airDate && (
              <Text d="inline" fontSize="md">
                ({moment(season.airDate).year()})
              </Text>
            )}
          </Box>
          <Box mr="20px" textAlign="right">
            <Text fontSize="md">{season.episodes.length} Episodes</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel p={isMobile ? '10px 0 5px' : '10px'}>
          <EpisodesTable episodes={season.episodes} isMobile={isMobile} />
        </AccordionPanel>
      </AccordionItem>
    ));

  return (
    <Flex direction="column" flex="1" mt={isMobile ? '25px' : '50px'}>
      <Heading as="h3" fontSize="2xl" ml={isMobile ? '' : '14px'}>
        Seasons & Episodes
      </Heading>
      <Accordion mt="14px" w="100%" allowToggle>
        {createAccordionItems()}
      </Accordion>
    </Flex>
  );
};

export default SeasonAccordionGroup;
