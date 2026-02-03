import { ShowCard, type ShowItem } from '~/components/ShowCard';

type Props = {
  show: ShowItem;
};

export const SimilarShowCard = ({ show }: Props) => (
  <ShowCard.Root show={show}>
    <ShowCard.Image />
    <ShowCard.BottomSection>
      <ShowCard.Title />
      <ShowCard.FollowButton />
    </ShowCard.BottomSection>
  </ShowCard.Root>
);
