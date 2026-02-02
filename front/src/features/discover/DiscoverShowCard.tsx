import { useState } from 'react';

import { ShowCard, type ShowItem } from '~/components/ShowCard';

type Props = {
  show: ShowItem;
};

export const DiscoverShowCard = ({ show }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ShowCard.Root show={show} onHoverChange={setIsHovered}>
      <ShowCard.Image show={show}>
        <ShowCard.Overview overview={show.overview} isHovered={isHovered} />
      </ShowCard.Image>
      <ShowCard.BottomSection>
        <ShowCard.Title show={show} />
        <ShowCard.FollowButton showId={show.id} />
      </ShowCard.BottomSection>
    </ShowCard.Root>
  );
};
