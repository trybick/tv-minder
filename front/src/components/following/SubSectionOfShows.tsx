import { Grid } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import Show from './Show';

type Props = {
  shows: BasicShowInfo[];
  isMobile: boolean;
};

const SubSectionOfShows = (props: Props) => {
  const { shows, isMobile } = props;

  return (
    <Grid
      gap={isMobile ? '20px' : '40px 44px'}
      gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))"
      justifyContent="center"
    >
      {shows.map(show => (
        <Show key={show.id} show={show} />
      ))}
    </Grid>
  );
};

export default SubSectionOfShows;
