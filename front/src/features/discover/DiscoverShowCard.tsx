import { useState } from 'react';

import { ShowCard, type ShowItem } from '~/components/ShowCard';

type Props = {
  show: ShowItem;
};

export const DiscoverShowCard = ({ show }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ShowCard.Root
      show={show}
      onHoverChange={setIsHovered}
      followButtonSize="sm"
    >
      <ShowCard.Image>
        <ShowCard.Overview isHovered={isHovered} />
      </ShowCard.Image>
      <ShowCard.BottomSection>
        <ShowCard.Title />
        <ShowCard.FollowButton />
      </ShowCard.BottomSection>
    </ShowCard.Root>
  );
};
