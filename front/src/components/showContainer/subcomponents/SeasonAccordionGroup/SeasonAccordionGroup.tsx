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

type Props = {
  isMobile: boolean;
  showInfoForDisplay: BasicShowInfo;
};

const SeasonAccordionGroup = ({ isMobile, showInfoForDisplay }: Props) => {
  const { seasonsWithEpisodes } = showInfoForDisplay || {};

  const createAccordionItems = () =>
    seasonsWithEpisodes.map(({ airDate, episodes, id, isSpecialsSeason, nameForDisplay }) => (
      <AccordionItem key={id}>
        <AccordionButton px={isMobile ? '8px' : '16px'}>
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
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel p={isMobile ? '10px 0 5px' : '10px'}>
          <EpisodesTable episodes={episodes} isMobile={isMobile} />
        </AccordionPanel>
      </AccordionItem>
    ));

  return (
    <Flex direction="column" flex="1" mt={isMobile ? '18px' : '50px'}>
      <Heading as="h4" fontSize={isMobile ? 'xl' : '2xl'} ml={isMobile ? '' : '14px'}>
        Episodes
      </Heading>
      <Accordion mt="14px" w="100%" allowToggle>
        {createAccordionItems()}
      </Accordion>
    </Flex>
  );
};

export default SeasonAccordionGroup;
