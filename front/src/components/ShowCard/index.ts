import { BottomSection } from './BottomSection';
import { FollowButton } from './FollowButton';
import { Image } from './Image';
import { Overview } from './Overview';
import { Root } from './Root';
import { StatusBadge } from './StatusBadge';
import { Title } from './Title';
import { UnfollowXButton } from './UnfollowXButton';

export const ShowCard = {
  Root,
  Image,
  StatusBadge,
  Overview,
  BottomSection,
  Title,
  FollowButton,
  UnfollowXButton,
};

export {
  getStatusBadge,
  mapPopularShow,
  mapShowForDisplay,
  mapTmdbShowSummary,
  type ShowItem,
  type StatusBadge,
} from './helpers';
