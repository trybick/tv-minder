import { getStatusBadge, ShowCard } from '~/components/ShowCard';
import { type ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  shows: ShowForDisplay[];
};

export const SubSectionOfShows = ({ shows }: Props) => {
  return (
    <ShowCard.Grid>
      {shows.map(show => {
        const badge = getStatusBadge(show.status);
        return (
          <ShowCard.Root key={show.id} show={show}>
            <ShowCard.UnfollowXButton />
            <ShowCard.Image>
              {badge && <ShowCard.StatusBadge {...badge} />}
            </ShowCard.Image>
            <ShowCard.BottomSection>
              <ShowCard.Title />
            </ShowCard.BottomSection>
          </ShowCard.Root>
        );
      })}
    </ShowCard.Grid>
  );
};
