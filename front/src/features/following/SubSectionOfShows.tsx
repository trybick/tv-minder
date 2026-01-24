import { Grid } from '@chakra-ui/react';

import { useIsMobile } from '~/hooks/useIsMobile';
import { type ShowForDisplay } from '~/store/tv/types/transformed';

import { Show } from './Show';

type Props = {
  shows: ShowForDisplay[];
};

export const SubSectionOfShows = (props: Props) => {
  const { shows } = props;
  const isMobile = useIsMobile();

  return (
    <Grid
      gap={isMobile ? '12px' : '24px 28px'}
      gridTemplateColumns={{
        base: 'repeat(auto-fill, minmax(160px, 1fr))',
        md: 'repeat(auto-fill, minmax(190px, 1fr))',
      }}
      justifyContent="center"
    >
      {shows.map(show => (
        <Show key={show.id} show={show} />
      ))}
    </Grid>
  );
};
