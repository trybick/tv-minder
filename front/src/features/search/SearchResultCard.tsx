import { useState } from 'react';

import {
  getStatusBadge,
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
    <ShowCard.Root show={show} onHoverChange={setIsHovered}>
      <ShowCard.Image show={show}>
        {badge && <ShowCard.StatusBadge {...badge} />}
        <ShowCard.OverviewOverlay overview={show.overview} isHovered={isHovered} />
      </ShowCard.Image>
      <ShowCard.Details>
        <ShowCard.Title show={show} />
        <ShowCard.Follow showId={show.id} />
      </ShowCard.Details>
    </ShowCard.Root>
  );
};
