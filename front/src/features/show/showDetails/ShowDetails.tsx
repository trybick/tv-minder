import { Box } from '@chakra-ui/react';

import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
} from '~/store/tv/selectors';

import { AirDates } from './AirDates';
import { Genres } from './Genres';
import { Overview } from './Overview';
import { RatingRow } from './RatingRow';
import { TitleRow } from './TitleRow';

export const ShowDetails = () => {
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const isLoading = useAppSelector(selectIsLoadingShowDetails);

  return (
    <Box
      w="100%"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 5 }}
      minH={isLoading ? { base: '380px', md: '470px' } : undefined}
      borderRadius={{ base: 'xl', md: '2xl' }}
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      bg="linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)"
      boxShadow="0 18px 45px rgba(0, 0, 0, 0.35)"
      backdropFilter="blur(6px)"
    >
      <TitleRow show={currentShowInfo} />
      <RatingRow show={currentShowInfo} />
      <Genres show={currentShowInfo} />
      <Overview show={currentShowInfo} />
      <AirDates show={currentShowInfo} />
    </Box>
  );
};
