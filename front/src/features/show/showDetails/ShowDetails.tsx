import { Box } from '@chakra-ui/react';

import { useAppSelector } from '~/store';
import { selectCurrentShowInfo } from '~/store/tv/selectors';

import { AirDates } from './AirDates';
import { Genres } from './Genres';
import { Metadata } from './Metadata';
import { Overview } from './Overview';
import { Rating } from './Rating';
import { Title } from './Title';

export const ShowDetails = () => {
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);

  return (
    <Box w="100%">
      <Title show={currentShowInfo} />
      <Rating show={currentShowInfo} />
      <Genres show={currentShowInfo} />
      <Overview show={currentShowInfo} />
      <AirDates show={currentShowInfo} />
      <Metadata show={currentShowInfo} />
    </Box>
  );
};
