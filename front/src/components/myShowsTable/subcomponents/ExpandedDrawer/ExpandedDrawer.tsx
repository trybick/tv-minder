import { Row } from 'react-table';
import { Flex, Grid, Td, Tr, useColorModeValue, useMediaQuery } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import EpisodeGroups from './subcomponents/EpisodeGroups';

interface Props {
  isExpanded: boolean;
  row: Row<BasicShowInfo>;
}

const ExpandedDrawer = ({ isExpanded, row }: Props) => {
  const [isMobile] = useMediaQuery(['(max-width: 768px)']);
  const { lastEpisodeForDisplay, id, nextEpisodeForDisplay } = row.original;
  const cellBackgroundColor = useColorModeValue('#f7f5f5', '#252E41');

  return isExpanded ? (
    <Tr>
      <Td
        bg={cellBackgroundColor}
        colSpan={row.allCells.length}
        p={isMobile ? '0 20px 20px' : '10px 60px 25px'}
      >
        {isMobile ? (
          <Flex direction="column" gap="20px">
            <EpisodeGroups
              lastEpisode={lastEpisodeForDisplay}
              nextEpisode={nextEpisodeForDisplay}
              showId={id}
            />
          </Flex>
        ) : (
          <Grid gap="20px" justify="space-around" templateColumns="1fr 1fr 1fr">
            <EpisodeGroups
              lastEpisode={lastEpisodeForDisplay}
              nextEpisode={nextEpisodeForDisplay}
              showId={id}
            />
          </Grid>
        )}
      </Td>
    </Tr>
  ) : null;
};

export default ExpandedDrawer;
