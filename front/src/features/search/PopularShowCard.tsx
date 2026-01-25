import { useState } from 'react';

import { ShowCard, type ShowItem } from '~/components/ShowCard';

type Props = {
  show: ShowItem;
};

export const PopularShowCard = ({ show }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ShowCard.Root show={show} onHoverChange={setIsHovered}>
      <ShowCard.Image show={show}>
        <ShowCard.OverviewOverlay overview={show.overview} isHovered={isHovered} />
      </ShowCard.Image>
      <ShowCard.Details>
        <ShowCard.Title show={show} />
        <ShowCard.Follow showId={show.id} />
      </ShowCard.Details>
    </ShowCard.Root>
  );
};
