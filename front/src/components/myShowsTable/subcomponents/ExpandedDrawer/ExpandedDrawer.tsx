import { Row } from 'react-table';
import { Flex, Grid, Td, Tr, useColorModeValue } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsMobile } from 'hooks/useIsMobile';
import { BasicShowInfo } from 'types/external';
import EpisodeGroups from './subcomponents/EpisodeGroups';

type Props = {
  isExpanded: boolean;
  row: Row<BasicShowInfo>;
};

const ExpandedDrawer = ({ isExpanded, row }: Props) => {
  const isMobile = useIsMobile();
  const { lastEpisodeForDisplay, id, nextEpisodeForDisplay } = row.original;
  const cellBackgroundColor = useColorModeValue('#f7f5f5', '#252E41');

  const motionProps = {
    animate: 'open',
    exit: 'collapsed',
    initial: 'collapsed',
    key: 'content',
    transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
    variants: {
      open: { opacity: 1, height: 'auto' },
      collapsed: { opacity: 0, height: 0 },
    },
  };

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <Tr>
          <Td
            bg={cellBackgroundColor}
            colSpan={row.allCells.length}
            p={isMobile ? '0 20px 20px' : '12px 60px 32px'}
          >
            <motion.section {...motionProps}>
              {isMobile ? (
                <Flex direction="column" gap="20px">
                  <EpisodeGroups
                    lastEpisode={lastEpisodeForDisplay}
                    nextEpisode={nextEpisodeForDisplay}
                    showId={id}
                    isMobile
                  />
                </Flex>
              ) : (
                <Grid
                  gap="20px"
                  templateColumns={nextEpisodeForDisplay ? '1fr 1fr 1fr' : '1fr 1fr'}
                >
                  <EpisodeGroups
                    lastEpisode={lastEpisodeForDisplay}
                    nextEpisode={nextEpisodeForDisplay}
                    showId={id}
                  />
                </Grid>
              )}
            </motion.section>
          </Td>
        </Tr>
      )}
    </AnimatePresence>
  );
};

export default ExpandedDrawer;
