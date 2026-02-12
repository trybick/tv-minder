import {
  Box,
  EmptyState,
  Flex,
  Grid,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuMessageSquare } from 'react-icons/lu';

import { type ShowReview } from '~/store/tv/types/transformed';
import { dayjs } from '~/utils/dayjs';

const REVIEW_SNIPPET_MAX_CHARS = 280;

const toSnippet = (content: string) => {
  if (content.length <= REVIEW_SNIPPET_MAX_CHARS) {
    return content;
  }

  return `${content.slice(0, REVIEW_SNIPPET_MAX_CHARS).trimEnd()}...`;
};

type Props = {
  reviews: ShowReview[];
};

export const Reviews = ({ reviews }: Props) => {
  if (!reviews.length) {
    return (
      <Box
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius="xl"
        bg="whiteAlpha.50"
        p={4}
      >
        <EmptyState.Root size="sm">
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuMessageSquare />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>No reviews yet</EmptyState.Title>
              <EmptyState.Description>
                No audience reviews have been posted for this show yet.
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Box>
    );
  }

  return (
    <Grid
      templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}
      gap={3}
    >
      {reviews.slice(0, 3).map(review => (
        <Box
          key={review.id}
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="lg"
          bg="whiteAlpha.100"
          p={3.5}
          h="100%"
        >
          <Flex justify="space-between" gap={4} mb={2} wrap="wrap">
            <Text fontWeight="700" fontSize="sm">
              {review.author}
            </Text>
            <Text color="fg.muted" fontSize="xs">
              {dayjs(review.createdAt).format('MMM D, YYYY')}
            </Text>
          </Flex>
          <Text color="fg.muted" fontSize="sm" lineHeight="1.6" mb={2}>
            {toSnippet(review.content)}
          </Text>
          <Link
            color="cyan.300"
            fontSize="sm"
            href={review.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Read full review
          </Link>
        </Box>
      ))}
    </Grid>
  );
};
