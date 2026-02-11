import { Box } from '@chakra-ui/react';

import { useAppSelector } from '~/store';
import { selectCurrentShowInfo } from '~/store/tv/selectors';

import { AirDates } from './AirDates';
import { Genres } from './Genres';
// import { Metadata } from './Metadata';
import { Overview } from './Overview';
import { RatingRow } from './RatingRow';
import { TitleRow } from './TitleRow';

export const ShowDetails = () => {
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);

  return (
    <Box w="100%">
      <TitleRow show={currentShowInfo} />
      <RatingRow show={currentShowInfo} />
      <Genres show={currentShowInfo} />
      <Overview show={currentShowInfo} />
      <AirDates show={currentShowInfo} />
      {/* Metadata removed for nowin favor of rich content */}
      {/* <Metadata show={currentShowInfo} /> */}
    </Box>
  );
};
