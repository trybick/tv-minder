import { BottomSection } from '~/components/ShowCard/BottomSection';
import { Grid } from '~/components/ShowCard/Grid';
import { Image } from '~/components/ShowCard/Image';
import { Overview } from '~/components/ShowCard/Overview';
import { Root } from '~/components/ShowCard/Root';
import { StatusBadge } from '~/components/ShowCard/StatusBadge';
import { Title } from '~/components/ShowCard/Title';
import { TrackButton } from '~/components/ShowCard/TrackButton';
import { UntrackButton } from '~/components/ShowCard/UntrackButton';

export const ShowCard = {
  Root,
  Grid,
  Image,
  StatusBadge,
  Overview,
  BottomSection,
  Title,
  TrackButton,
  UntrackButton,
};

export {
  getStatusBadge,
  mapTmdbShowSummary,
  type ShowItem,
  type StatusBadge,
} from '~/components/ShowCard/helpers';

export { showElementsByBreakpoint } from '~/components/ShowCard/Grid';
