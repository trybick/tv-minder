import { Grid } from '@chakra-ui/react';

import { useIsMobile } from '~/hooks/useIsMobile';
import { ShowForDisplay } from '~/store/tv/types/transformed';

import { Show } from './Show';

type Props = {
  shows: ShowForDisplay[];
};

export const SubSectionOfShows = (props: Props) => {
  const { shows } = props;
  const isMobile = useIsMobile();

  return (
    <Grid
      gap={isMobile ? '20px' : '40px 44px'}
      gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))"
      justifyContent="center"
    >
      {shows.map(show => (
        <Show key={show.id} show={show} />
      ))}
    </Grid>
  );
};
