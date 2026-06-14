import { getStatusBadge, ShowCard } from '~/components/ShowCard';
import { type ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  shows: ShowForDisplay[];
  hideStatusBadge?: boolean;
};

export const SubSectionOfShows = ({ shows, hideStatusBadge }: Props) => {
  return (
    <ShowCard.Grid>
      {shows.map(show => {
        const badge = hideStatusBadge ? null : getStatusBadge(show.status);
        return (
          <ShowCard.Root key={show.id} show={show}>
            <ShowCard.UntrackButton />
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
