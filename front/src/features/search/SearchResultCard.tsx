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
      <ShowCard.Image show={show}>
        {badge && <ShowCard.StatusBadge {...badge} />}
        <ShowCard.Overview overview={show.overview} isHovered={isHovered} />
      </ShowCard.Image>
      <ShowCard.BottomSection>
        <ShowCard.Title show={show} />
        <ShowCard.FollowButton showId={show.id} />
      </ShowCard.BottomSection>
    </ShowCard.Root>
  );
};
