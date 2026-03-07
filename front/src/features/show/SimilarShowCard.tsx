import { ShowCard, type ShowItem } from '~/components/ShowCard';

type Props = {
  show: ShowItem;
};

export const SimilarShowCard = ({ show }: Props) => (
  <ShowCard.Root show={show} trackButtonSize="sm">
    <ShowCard.Image />
    <ShowCard.BottomSection>
      <ShowCard.Title />
      <ShowCard.TrackButton />
    </ShowCard.BottomSection>
  </ShowCard.Root>
);
