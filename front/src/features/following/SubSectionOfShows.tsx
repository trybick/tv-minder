import { useMemo } from 'react';

import {
  getStatusBadge,
  mapShowForDisplay,
  ShowCard,
} from '~/components/ShowCard';
import { type ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  shows: ShowForDisplay[];
};

export const SubSectionOfShows = ({ shows }: Props) => {
  const showItems = useMemo(() => shows.map(mapShowForDisplay), [shows]);

  return (
    <ShowCard.Grid>
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
    </ShowCard.Grid>
  );
};
