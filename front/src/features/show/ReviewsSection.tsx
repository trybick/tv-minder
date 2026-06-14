import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import { type ShowReview } from '~/store/tv/types/transformed';

import { Reviews } from './showDetails/richContent/Reviews';

type Props = {
  reviews: ShowReview[];
};

export const ReviewsSection = ({ reviews }: Props) => {
  return (
    <Box>
      <Flex mb={5} direction="column" gap={1}>
        <Heading
          as="h2"
          fontSize={{ base: 'xl', md: '2xl' }}
          letterSpacing="-0.02em"
        >
          Reviews
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          What viewers are saying about this show.
        </Text>
      </Flex>
      <Reviews reviews={reviews} />
    </Box>
  );
};
