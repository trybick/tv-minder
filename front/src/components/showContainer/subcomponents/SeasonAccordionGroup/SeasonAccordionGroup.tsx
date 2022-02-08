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
  showInfoForDisplay: BasicShowInfo;
}

const SeasonAccordionGroup = ({ showInfoForDisplay }: Props) => {
  const { seasonsWithEpisodes } = showInfoForDisplay || {};

  const createAccordionItems = () =>
    seasonsWithEpisodes.map(season => (
      <AccordionItem key={season.id}>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Text d="inline" fontSize="lg" fontWeight="600">
              {season.nameForDisplay}
            </Text>{' '}
            <Text d="inline" fontSize="md">
              ({moment(season.airDate).year()})
            </Text>
          </Box>
          <Box mr="20px" textAlign="right">
            <Text fontSize="md">{season.episodes.length} Episodes</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel p="10px 20px 20px">
          <EpisodesTable episodes={season.episodes} />
        </AccordionPanel>
      </AccordionItem>
    ));

  return (
    <Flex direction="column" flex="1" mt="50px">
      <Heading as="h3" fontSize="2xl" ml="14px">
        Seasons & Episodes
      </Heading>
      <Accordion mt="14px" w="100%" allowToggle>
        {createAccordionItems()}
      </Accordion>
    </Flex>
  );
};

export default SeasonAccordionGroup;
