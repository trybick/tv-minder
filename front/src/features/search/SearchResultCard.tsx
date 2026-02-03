import { useState } from 'react';

import {
  type getStatusBadge,
  ShowCard,
  type ShowItem,
} from '~/components/ShowCard';

type Props = {
  show: ShowItem;
  badge: ReturnType<typeof getStatusBadge>;
};

export const SearchResultCard = ({ show, badge }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ShowCard.Root
      show={show}
      onHoverChange={setIsHovered}
      aria-label="search-result"
    >
      <ShowCard.Image>
        {badge && <ShowCard.StatusBadge {...badge} />}
        <ShowCard.Overview isHovered={isHovered} />
      </ShowCard.Image>
      <ShowCard.BottomSection>
        <ShowCard.Title />
        <ShowCard.FollowButton />
      </ShowCard.BottomSection>
    </ShowCard.Root>
  );
};
