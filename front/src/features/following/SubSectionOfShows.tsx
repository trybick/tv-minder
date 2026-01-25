import { Grid } from '@chakra-ui/react';
import { useMemo } from 'react';

import {
  getStatusBadge,
  mapShowForDisplay,
  ShowCard,
} from '~/components/ShowCard';
import { useIsMobile } from '~/hooks/useIsMobile';
import { type ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  shows: ShowForDisplay[];
};

export const SubSectionOfShows = ({ shows }: Props) => {
  const isMobile = useIsMobile();
  const showItems = useMemo(() => shows.map(mapShowForDisplay), [shows]);

  return (
    <Grid
      gap={isMobile ? '12px' : '24px 28px'}
      gridTemplateColumns={{
        base: 'repeat(auto-fill, minmax(160px, 1fr))',
        md: 'repeat(auto-fill, minmax(190px, 1fr))',
      }}
      justifyContent="center"
    >
      {showItems.map(show => {
        const badge = getStatusBadge(show.status);
        return (
          <ShowCard.Root key={show.id} show={show}>
            <ShowCard.UnfollowXButton showId={show.id} showName={show.name} />
            <ShowCard.Image show={show}>
              {badge && <ShowCard.StatusBadge {...badge} />}
            </ShowCard.Image>
            <ShowCard.BottomSection>
              <ShowCard.Title show={show} />
            </ShowCard.BottomSection>
          </ShowCard.Root>
        );
      })}
    </Grid>
  );
};
